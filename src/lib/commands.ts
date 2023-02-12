import microfs, { type CommandFunc } from "micro-memfs";

const fs = microfs(
  {
    "/secrets/adam.txt": "Easter egg #1! (╯°□°）╯︵ ┻━┻",
    "/.hidden.txt": "Easter egg #2!",
  },
  {
    "/bitcoin_miner": bitcoin_miner,
  }
);

interface CommandDef {
  cmd: CommandFunc;
  desc: string;
  usage: string;
}

const commandMap: { [id: string]: CommandDef } = {
  help: { cmd: help, desc: "Opens this help menu.", usage: "help" },
  pwd: {
    cmd: () => [fs.cwd()],
    desc: "Prints the current working directory.",
    usage: "pwd",
  },
  ls: {
    cmd: ls,
    desc: "Lists files in the given directory.",
    usage: "ls [options] <directory>",
  },
  cat: {
    cmd: cat,
    desc: "Very simple file reading utility.",
    usage: "cat <file>",
  },
  git: {
    cmd: git,
    desc: "Explore my public projects on GitHub.",
    usage: "git",
  },
};

function bitcoin_miner(args: string[]): string[] {
  // Taken from top answer here https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  function makeid(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "0x" + result;
  }

  if (args[0] === "p455w0rd") {
    return ["Easter egg #3!"];
  }

  const amount = Math.floor(Math.random() * 5) + 1;
  return [`${amount} BTC mined! Sent to ${makeid(32)}`];
}

// Coming to the realisation I've spent about 3 hours making a fake file system & fake unix commands for a fake console for a fun little website...

function cat(ops: string[]): string[] {
  var e = "cat: ";
  if (ops.length < 1) {
    return [e + "requires input file"];
  }

  var p = ops[0];
  e += `${p}: `;

  if (!fs.exists(p)) {
    return [e + "no such file"];
  }

  if (fs.isDirectory(p)) {
    return [e + "is a directory"];
  }

  return fs.readFile(p).split("\n");
}

async function git(): Promise<string[]> {
  const url = "https://api.github.com/users/awphi/repos";
  try {
    const res = await fetch(url, {
      method: "GET",
    });
    if (!res.ok) {
      throw Error(res.statusText);
    }
    const json = await res.json();
    json.forEach((v) => {
      v.created_at = Date.parse(v.created_at);
    });
    const jsonSorted = json.sort(function (a, b) {
      return a.created_at - b.created_at;
    });
    return jsonSorted.flatMap((o, idx) => [
      `${idx + 1}) ${o.name}`,
      `    Description: ${o.description}`,
      `    Created: ${new Date(o.created_at).toDateString()}`,
      `    Primary language: ${o.language}`,
      " ",
      " ",
    ]);
  } catch (e) {
    return [`git: error when fetching: ${e}`];
  }
}

function ls(ops: string[]): string[] {
  let a = false;
  let e = "ls: ";
  let dir = fs.cwd();

  while (ops.length > 0) {
    var op = ops.pop();

    switch (op) {
      case "-a":
        a = true;
        break;
      default:
        if (op.startsWith("-")) {
          return [`ls: unknown option ${op}`];
        } else {
          dir = op;
        }
    }
  }

  e += `${dir}: `;

  if (!fs.exists(dir)) {
    return [e + "no such directory"];
  }

  if (!fs.isDirectory(dir)) {
    return [e + "is a file"];
  }

  const files = fs.readDir(dir).filter((o: string) => {
    if (!o.startsWith(".") || a) {
      return o;
    }
  });
  return [files.join("    ")];
}

function help(): string[] {
  var result: string[] = [];
  for (let i in commandMap) {
    const def = commandMap[i];
    result.push(`${i} - ${def.desc}`);
    result.push(`  Usage: ${def.usage}`);
    result.push(" ");
  }
  return result;
}

export async function execute(
  cmd: string,
  terminalName: string = "bash"
): Promise<string[]> {
  const arr = cmd.trim().split(" ");
  const ops = [...new Set(arr.splice(1))];
  const prog = arr[0].replaceAll(/\.|\//g, "");

  if (prog in commandMap) {
    const res = await commandMap[prog].cmd(ops);
    return res;
  }

  const exe = fs.findExecutable(prog);
  if (exe !== null) {
    const res = await exe(ops);
    return res;
  }

  return Promise.resolve([`${terminalName}: ${prog}: command not found`]);
}

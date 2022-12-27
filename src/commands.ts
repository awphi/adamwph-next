import { resolve, parse } from "path";

type CommandFunc = (args: string[]) => string[] | Promise<string[]>;

interface CommandDef {
  cmd: CommandFunc;
  desc: string;
  usage: string;
}

// Specify our executables - these will get added to the in-mem fs as readable files that can also be executed
const executables: { [id: string]: CommandFunc } = {
  "/bitcoin_miner": bitcoin_miner,
};

// Specify our text files. We can specify dirs here
const volDef = {
  "/secrets/adam.txt": "Easter egg #1! (╯°□°）╯︵ ┻━┻",
  "/.hidden.txt": "Easter egg #2!",
};

// Add our executables source code to the file system
Object.entries(executables).forEach(([id, f]) => {
  volDef[id] = f.toString();
});

// Micro-fs API to keep bundle size small
const fs = {
  exists(pth: string): boolean {
    const res = resolve(pth);
    // Resolve all the unique directories present in the volume definition
    const dirs = [...new Set(Object.keys(volDef).map((d) => parse(d).dir))];
    return (
      res in volDef || dirs.includes(res) || dirs.some((d) => d.startsWith(res))
    );
  },
  isDirectory(pth: string): boolean {
    // Naive as hell but works for this simple app
    return fs.exists(pth) && !resolve(pth).includes(".");
  },
  readFile(pth: string): string | undefined {
    return volDef[resolve(pth)];
  },
  readDir(pth: string): string[] {
    const res = resolve(pth);
    const contents = Object.keys(volDef)
      .filter((a) => a.startsWith(res))
      .map((a) => {
        // Lob of the directory from the start of the URI
        const lobbed = a.split(res)[1];
        const parts = lobbed.split("/");
        // Only search 1 level deep, we take the min to deal with being at root (/)
        return parts[Math.min(parts.length - 1, 1)];
      });
    // Unique-ify
    return [...new Set(contents)];
  },
};

const commandMap: { [id: string]: CommandDef } = {
  help: { cmd: help, desc: "Opens this help menu.", usage: "help" },
  pwd: {
    cmd: () => [process.cwd()],
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
  let dir = process.cwd();

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
  // We use U+2003 for some padding
  return [files.join(" ")];
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

  if (fs.exists(prog)) {
    const exe = resolve(`./${prog}`);
    if (exe in executables) {
      const res = await executables[exe](ops);
      return res;
    }
  }

  return Promise.resolve([`${terminalName}: ${prog}: command not found`]);
}

import { resolve, parse } from "path-browserify";

export type CommandFunc = (args: string[]) => string[] | Promise<string[]>;

interface MicroFs {
  exists(path: string): boolean;
  isDirectory(path: string): boolean;
  readFile(pth: string): string | undefined;
  readDir(pth: string): string[];
  cwd(): string;
  findExecutable(prog: string): CommandFunc | undefined;
}

export function makeFs(
  voldDefIn: { [path: string]: string },
  executables: { [id: string]: CommandFunc }
): MicroFs {
  const volDef = { ...voldDefIn };
  // Add our executables source code to the file system
  Object.entries(executables).forEach(([id, f]) => {
    volDef[id] = f.toString();
  });
  const cwd = "/";
  // path.resolve uses process.cwd() to resolve relative directory inputs
  // so we wrap all calls to path.resolve to ensure that cwd is accurate to this micro file system
  function resolvePath(path: string): string {
    (window as any).process = process;
    return resolve(path);
  }

  const fs = {
    exists(pth: string): boolean {
      const res = resolvePath(pth);
      // Resolve all the unique directories present in the volume definition
      const dirs = [...new Set(Object.keys(volDef).map((d) => parse(d).dir))];
      return (
        res in volDef ||
        dirs.includes(res) ||
        dirs.some((d) => d.startsWith(res))
      );
    },
    isDirectory(pth: string): boolean {
      // Naive as hell but works for this simple app
      const res = resolvePath(pth);
      return fs.exists(pth) && !res.includes(".") && !(res in executables);
    },
    readFile(pth: string): string | undefined {
      return volDef[resolvePath(pth)];
    },
    readDir(pth: string): string[] {
      const res = resolvePath(pth);
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
    cwd: () => cwd,
    findExecutable: (prog: string): CommandFunc | null => {
      if (fs.exists(prog)) {
        const exe = resolvePath(`./${prog}`);
        if (exe in executables) {
          return executables[exe];
        }
      }
      return null;
    },
  };

  const process = {
    cwd: fs.cwd,
  };

  return fs;
}

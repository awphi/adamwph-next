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
  // TODO if we ever allow cwd to change we will need a way to set an "active" microfs instance
  const cwd = "/";
  const fs = {
    exists(pth: string): boolean {
      const res = resolve(pth);
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
      const res = resolve(pth);
      return fs.exists(pth) && !res.includes(".") && !(res in executables);
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
    cwd: () => cwd,
    findExecutable: (prog: string): CommandFunc | null => {
      if (fs.exists(prog)) {
        const exe = resolve(`./${prog}`);
        if (exe in executables) {
          return executables[exe];
        }
      }
      return null;
    },
  };

  (window as any).process = {
    cwd: fs.cwd,
  };

  return fs;
}

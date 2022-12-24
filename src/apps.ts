import type { AppDef } from "./types";
import ConsoleWindowContent from "./ConsoleWindowContent.svelte";
import PrismWindowContent from "./PrismWindowContent.svelte";

export const appDefs: AppDef[] = [
  {
    name: "Terminal",
    icon: "mdi:console",
    component: ConsoleWindowContent,
    spawn() {
      return {
        title: "Terminal",
        left: 200,
        top: 100,
      };
    },
  },
  {
    name: "welcome.txt",
    icon: "mdi:file-document-outline",
    component: PrismWindowContent,
    spawn() {
      return {
        title: "welcome.txt",
        left: 200,
        top: 100,
        resizable: true,
        props: {
          language: "markdown",
          source: import("./assets/welcome.md?raw"),
        },
      };
    },
  },
];

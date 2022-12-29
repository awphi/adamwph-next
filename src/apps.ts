import type { AppDef } from "./types";
import ConsoleWindowContent from "./ConsoleWindowContent.svelte";
import PrismWindowContent from "./PrismWindowContent.svelte";

/**
 * New apps can be added here, they have a few required properties and must implement a method to spawn a new window of the app.
 * This window has an optional props object which can be used to pass data to the window content component specified in the AppDef.
 */
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
        resizable: true,
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

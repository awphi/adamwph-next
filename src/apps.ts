import type { AppDef, PartialWindow } from "./types";
import ConsoleWindowContent from "./ConsoleWindowContent.svelte";
import PrismWindowContent from "./PrismWindowContent.svelte";

export const defaultWindowProps: Required<PartialWindow> = {
  left: 100,
  top: 100,
  windowWidth: 600,
  windowHeight: 400,
  resizable: true,
  isMaximized: false,
  isMinimized: false,
  title: "Unknown Window",
  props: {},
};

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
        windowWidth: 640,
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
        props: {
          language: "markdown",
          source: import("./assets/welcome.md?raw"),
        },
      };
    },
  },
];

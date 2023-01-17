import type { AppDef } from "./types";
import ConsoleWindowContent from "./ConsoleWindowContent.svelte";
import PrismWindowContent from "./PrismWindowContent.svelte";
import DissertationWindowContent from "./EmbedWindowContent.svelte";
import GitProjectExplorerWindowContent from "./GitProjectExplorerWindowContent.svelte";

/**
 * New apps can be added here, they have a few required properties and must implement a method to spawn a new window of the app.
 * This window has an optional props object which can be used to pass data to the window content component specified in the AppDef.
 */
export const appDefs: AppDef[] = [
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
  {
    name: "Terminal",
    icon: "mdi:console",
    component: ConsoleWindowContent,
    spawn() {
      return {
        title: "Terminal",
        initialWidth: 640,
      };
    },
  },
  {
    name: "my-bachelors-paper.pdf",
    icon: "mdi:university-outline",
    component: DissertationWindowContent,
    spawn() {
      return {
        title: "GlassCasino - Adam Hodson",
        props: {
          type: "application/pdf",
          src: "./GlassCasino-AdamHodson.pdf",
        },
      };
    },
  },
  {
    name: "Project Explorer",
    icon: "mdi:projector-screen-outline",
    component: GitProjectExplorerWindowContent,
    spawn() {
      return {
        title: "GitHub Project Explorer",
        initialHeight: 440,
        initialWidth: 680,
      };
    },
  },
];

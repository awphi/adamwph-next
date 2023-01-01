import { quintOut, quintInOut } from "svelte/easing";
import type { PartialWindow } from "./types";

export const windowTransition = { delay: 0, duration: 300, easing: quintOut };

export const appIconBarTransition = {
  duration: 300,
  delay: 0,
  easing: quintInOut,
};

export const defaultWindowProps: Required<PartialWindow> = {
  left: 100,
  top: 100,
  initialWidth: 600,
  initialHeight: 400,
  resizable: true,
  isMaximized: false,
  isMinimized: false,
  isFocused: true,
  title: "Unknown Window",
  props: {},
};

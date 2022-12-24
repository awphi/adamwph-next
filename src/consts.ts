import { quintOut, quintInOut } from "svelte/easing";

export const windowTransition = { delay: 0, duration: 300, easing: quintOut };

export const appIconBarTransition = {
  duration: 300,
  delay: 0,
  easing: quintInOut,
};

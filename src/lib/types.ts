import type { ComponentType } from "svelte";

export interface WindowDef {
  title: string;
  app: AppDef;
  left: number;
  top: number;
  isMinimized: boolean;
  isMaximized: boolean;
  resizable: boolean;
  isFocused: boolean;
  props?: {
    [id: string]: any;
  };
  initialHeight: number;
  initialWidth: number;
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PartialWindow = Optional<
  Omit<WindowDef, "app">,
  | "isMaximized"
  | "isMinimized"
  | "resizable"
  | "initialWidth"
  | "initialHeight"
  | "left"
  | "top"
  | "isFocused"
>;

export interface AppDef {
  name: string;
  icon: string;
  component: ComponentType;
  spawn: () => PartialWindow;
  maxInstances?: number;
}

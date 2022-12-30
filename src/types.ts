import type { ComponentType } from "svelte";

export interface WindowDef {
  title: string;
  app: AppDef;
  left: number;
  top: number;
  isMinimized: boolean;
  isMaximized: boolean;
  resizable: boolean;
  props?: {
    [id: string]: any;
  };
  windowHeight: number;
  windowWidth: number;
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PartialWindow = Optional<
  Omit<WindowDef, "app">,
  | "isMaximized"
  | "isMinimized"
  | "resizable"
  | "windowWidth"
  | "windowHeight"
  | "left"
  | "top"
>;

export interface AppDef {
  name: string;
  icon: string;
  component: ComponentType;
  spawn: () => PartialWindow;
  maxInstances?: number;
}

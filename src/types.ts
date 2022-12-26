import type { ComponentType } from "svelte";

export interface WindowDef {
  title: string;
  app: AppDef;
  left: number;
  top: number;
  isMinimized?: boolean;
  isMaximized?: boolean;
  resizable?: boolean;
  props?: {
    [id: string]: any;
  };
  windowHeight?: number;
  windowWidth?: number;
}

export interface AppDef {
  name: string;
  icon: string;
  component: ComponentType;
  spawn: () => Omit<WindowDef, "app">;
  maxInstances?: number;
}

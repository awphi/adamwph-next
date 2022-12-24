import type { ComponentType } from "svelte";

export interface WindowDef {
  title: string;
  app: AppDef;
  left: number;
  top: number;
  // undefined = window is open but neither maximized nor minimized i.e. floating
  state?: "maximized" | "minimized";
  resizable?: boolean;
  props?: {
    [id: string]: any;
  };
  defaultHeight?: number;
  defaultWidth?: number;
}

export interface AppDef {
  name: string;
  icon: string;
  component: ComponentType;
  spawn: () => Omit<WindowDef, "app">;
}

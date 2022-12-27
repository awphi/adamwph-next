import App from "./App.svelte";
import process from "process";

window.process = process;

const app = new App({
  target: document.getElementById("app"),
});

export default app;

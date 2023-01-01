<script lang="ts">
  import { tick } from "svelte";
  import { execute } from "./commands";

  export let prompt = "adamw.ph";
  export let symbol = ":$";
  export let isFocused: boolean;
  export let moving: boolean;

  interface LineDef {
    type: "command" | "stdout";
    text: string;
  }

  async function onKeyPress(e: KeyboardEvent): Promise<void> {
    if (e.key === "Enter") {
      lines.push({
        type: "command",
        text: inputEl.value,
      });
      const output = await execute(inputEl.value);
      lines.push(
        ...output.map(
          (text) =>
            ({
              text: text,
              type: "stdout",
            } as LineDef)
        )
      );
      inputEl.value = "";
      lines = lines;
    }
  }

  let contentEl: HTMLDivElement;
  let inputEl: HTMLInputElement;
  let lines: LineDef[] = [
    {
      type: "stdout",
      text: "Welcome to the adamw.ph online CLI. Try using 'help' to get started!",
    },
  ];

  $: if (lines && contentEl) {
    // Await one tick for DOM to re-render with new line
    tick().then(() => {
      contentEl.parentElement.scrollTo(0, contentEl.parentElement.scrollHeight);
    });
  }

  // if (isFocused && !moving) can be used as a way of reactiving to being focused, unminimized or moved to re-obtain DOM focus
  $: if (isFocused && !moving && inputEl) {
    inputEl.focus();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="w-full flex-1 bg-neutral-900 px-2 py-1 flex flex-col whitespace-pre-wrap"
  on:click={() => inputEl.focus()}
  bind:this={contentEl}
>
  {#each lines as line}
    <div class="line">
      {#if line.type === "command"}
        <code>{prompt}{symbol}</code>
      {/if}
      <code
        class="line-content"
        class:text-neutral-400={line.type === "stdout"}
        class:text-green-500={line.type === "command"}>{line.text}</code
      >
    </div>
  {/each}
  <div class="line">
    <code>{prompt}{symbol}</code>
    <input
      bind:this={inputEl}
      type="text"
      name="Terminal Input"
      id="terminal-input"
      class="bg-transparent outline-none text-green-500 flex-1 line-content w-0"
      on:keypress={onKeyPress}
    />
  </div>
</div>

<style>
  .line {
    @apply flex gap-1;
  }

  .line-content {
    line-break: anywhere;
  }

  input {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
  }
</style>

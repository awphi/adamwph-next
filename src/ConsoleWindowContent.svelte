<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  interface LineDef {
    type: "command" | "stdout";
    text: string;
  }

  function onKeyPress(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      lines.push({
        type: "command",
        text: inputEl.value,
      });
      inputEl.value = "";
      // TODO push command output to lines
      lines = lines;
      // TODO autoscroll to bottom (might have to be on a timeout or a resize observer?)
    }
  }

  export let prompt = "adamw.ph";
  export let symbol = ":$";
  let inputEl: HTMLInputElement;
  let lines: LineDef[] = [
    {
      type: "stdout",
      text: "Welcome to the adamw.ph online CLI. Try using 'help' to get started!",
    },
  ];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="w-full flex-1 bg-neutral-900 px-2 py-1 flex flex-col"
  on:click={() => inputEl.focus()}
>
  {#each lines as line}
    <div class="line">
      {#if line.type === "command"}
        <span>{prompt}{symbol}</span>
      {/if}
      <span
        class:text-neutral-400={line.type === "stdout"}
        class:text-green-500={line.type === "command"}>{line.text}</span
      >
    </div>
  {/each}
  <div class="line">
    <span>{prompt}{symbol}</span>
    <input
      bind:this={inputEl}
      type="text"
      name="Terminal Input"
      id="terminal-input"
      class="bg-transparent outline-none text-green-500"
      on:keypress={onKeyPress}
    />
  </div>
</div>

<style>
  .line {
    @apply flex gap-1;
  }
</style>

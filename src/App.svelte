<script lang="ts">
  import Icon from "@iconify/svelte";
  import type { ComponentType } from "svelte";
  import ConsoleWindowContent from "./ConsoleWindowContent.svelte";
  import PlaceholderWindowContent from "./PlaceholderWindowContent.svelte";
  import Window from "./Window.svelte";

  interface WindowDef {
    component: ComponentType;
    title: string;
    left: number;
    top: number;
  }

  let focusedWindow = -1;

  let windows: WindowDef[] = [
    {
      component: ConsoleWindowContent,
      title: "Window 1",
      left: 200,
      top: 100,
    },
    {
      component: ConsoleWindowContent,
      title: "Window 2",
      left: 700,
      top: 100,
    },
    {
      component: PlaceholderWindowContent,
      title: "Window 3",
      left: 300,
      top: 300,
    },
  ];
</script>

<main class="flex flex-col h-full w-full">
  <div class="flex-1">
    {#each windows as window, i}
      {#if window !== null}
        <Window
          on:click={() => (focusedWindow = i)}
          on:close={() => {
            // We can't just filter out the window from the array as its position will be confused when animating
            // Setting it to null does the trick and let the gc worry about memory...
            windows[i] = null;
          }}
          bind:left={window.left}
          bind:top={window.top}
          title={window.title}
          class={"w-80 " + (focusedWindow === i ? "z-10" : "z-0")}
          headerClass={"bg-neutral-700" +
            (focusedWindow === i ? " filter contrast-[110%]" : "")}
        >
          <svelte:component this={window.component} />
        </Window>
      {/if}
    {/each}
  </div>
  <div class="flex items-end select-none p-4 z-10 footer pointer-events-none">
    <div class="flex flex-col">
      <h1 class="font-bold">Adam Hodson</h1>
      <h2>Graduate Software Engineer</h2>
      <h2>ComSci Class of 2022 @ Durham University</h2>
    </div>
    <div class="flex-1" />
    <div class="flex gap-2">
      <a href="https://github.com/awphi">
        <Icon icon="mdi:github" width="96" />
      </a>

      <a href="https://www.linkedin.com/in/adam-h-a77275197/">
        <Icon icon="mdi:linkedin" width="96" /></a
      >
    </div>
  </div>
</main>

<style>
  h2 {
    @apply text-2xl;
  }

  h1 {
    @apply text-4xl;
  }

  a {
    @apply hover:text-neutral-300 text-neutral-200 pointer-events-auto;
  }

  .footer {
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
</style>

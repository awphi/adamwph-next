<script lang="ts">
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import AppIconMenu from "./AppIconMenu.svelte";
  import { appIconBarTransition } from "./consts";
  import type { AppDef, WindowDef } from "./types";

  const dispatch = createEventDispatcher();

  let container: HTMLElement;
  let button: HTMLButtonElement;

  export let appWindows: WindowDef[];
  export let app: AppDef;

  let isMenuOpen = false;

  function onContextMenu(e: MouseEvent): void {
    // Firefox and Safari don't implictly focus a button on click
    button.focus();
    e.preventDefault();
    isMenuOpen = true;
  }

  function onClick(e: MouseEvent): void {
    // Firefox and Safari don't implictly focus a button on click
    button.focus();
    if (openInstancesOfApp.length === 0) {
      dispatch("spawn");
    } else if (openInstancesOfApp.length === 1) {
      dispatch("minimize-change", {
        appWindow: openInstancesOfApp[0],
        state: !openInstancesOfApp[0].isMinimized,
      });
    }
  }

  let maxInstances: number;
  $: maxInstances = app.maxInstances ?? 5;

  let openInstancesOfApp: WindowDef[];
  $: openInstancesOfApp = appWindows.filter((a) => a !== null && a.app === app);
</script>

<!-- Purposefully not using double click as a) it's bad on mobile and b) it's not expected for a website to respond to double clicks (usually) -->
<div class="relative flex flex-col items-center" bind:this={container}>
  <button
    class="app-icon"
    on:click={onClick}
    on:contextmenu={onContextMenu}
    bind:this={button}
    on:blur={() => {
      // We only close the menu if nothing in the menu has focus (to give it time to forward events back to this component) - it will close itself
      if (container.querySelector(":active") === null) {
        isMenuOpen = false;
      }
    }}
  >
    <Icon icon={app.icon} slot="icon" class="flex-1" width="84" />
    <p class="overflow-hidden w-full text-ellipsis">
      {app.name}
    </p>
    {#if openInstancesOfApp.length > 0}
      <div
        transition:fade={appIconBarTransition}
        class="h-[2px] w-full bg-neutral-500 rounded-md"
      />
    {/if}
  </button>
  <AppIconMenu
    instances={openInstancesOfApp}
    bind:open={isMenuOpen}
    on:focus={({ detail }) => dispatch("focus", detail)}
    on:spawn={() => dispatch("spawn")}
    {maxInstances}
  />
</div>

<style>
  .app-icon {
    outline-color: rgba(229, 229, 229, 0.3);
    grid-template-rows: min-content minmax(0, 1fr);
    @apply grid overflow-hidden w-28 h-28 justify-items-center outline-1 hover:outline focus:outline rounded-sm focus:bg-blue-600 hover:bg-neutral-200 hover:bg-opacity-5 focus:bg-opacity-5 transition-colors select-none px-2;
  }
</style>

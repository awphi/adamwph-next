<script lang="ts">
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { appIconBarTransition } from "./consts";

  import type { AppDef, WindowDef } from "./types";
  const dispatch = createEventDispatcher();

  export let appWindows: WindowDef[];
  export let app: AppDef;

  function onClick(): void {
    if (openInstancesOfApp.length === 1) {
      const w = openInstancesOfApp[0];
      dispatch("minimize-change", {
        appWindow: w,
        state: !w.isMinimized,
      });
    } else if (openInstancesOfApp.length > 1) {
      // TODO window preview thing to select which open instance to unminimize
    }
  }

  let openInstancesOfApp: WindowDef[];
  $: openInstancesOfApp = appWindows.filter((a) => a !== null && a.app === app);
</script>

<!-- TODO Touch events - single tap to spawn/toggle minimize when instances = 0 / 1, long hold to bring up multi-preview when instances > 1? Need gestures lib? -->
<button
  class="app-icon"
  on:click={onClick}
  on:dblclick={() => dispatch("spawn")}
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

<style>
  .app-icon {
    outline-color: rgba(229, 229, 229, 0.3);
    grid-template-rows: min-content minmax(0, 1fr);
    @apply grid overflow-hidden w-28 h-28 justify-items-center outline-1 hover:outline focus:outline rounded-sm focus:bg-blue-600 hover:bg-neutral-200 hover:bg-opacity-5 focus:bg-opacity-5 transition-colors select-none px-2;
  }
</style>

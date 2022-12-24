<script lang="ts">
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";

  import type { AppDef, WindowDef } from "./types";
  const dispatch = createEventDispatcher();

  export let app: AppDef;
</script>

<button
  class="app-icon"
  on:touchend={() => dispatch("spawn")}
  on:dblclick={() => dispatch("spawn")}
>
  <Icon icon={app.icon} slot="icon" class="flex-1" width="84" />
  <p class="overflow-hidden w-full text-ellipsis">
    {app.name}
  </p>
</button>

<style>
  .app-icon {
    outline-color: rgba(229, 229, 229, 0.3);
    grid-template-rows: min-content minmax(0, 1fr);
    @apply grid overflow-hidden w-28 h-28 justify-items-center outline-1 hover:outline focus:outline rounded-sm focus:bg-blue-600 hover:bg-neutral-200 hover:bg-opacity-5 focus:bg-opacity-5 transition-colors select-none px-2;
  }
</style>

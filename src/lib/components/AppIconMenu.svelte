<script lang="ts">
  import type { WindowDef } from "../types";
  import Icon from "@iconify/svelte";
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import { windowTransition } from "../consts";

  const dispatch = createEventDispatcher();

  export let instances: WindowDef[];
  export let open: boolean;
  export let maxInstances: number;
</script>

{#if open}
  <div
    class="flex flex-col items-center absolute top-full w-max"
    transition:scale={windowTransition}
  >
    <div class="arrow" />
    <div class="bg-neutral-900 p-2 rounded-md flex flex-col">
      {#each instances as instance}
        <button
          class="item"
          on:click={() => {
            dispatch("focus", instance);
            open = false;
          }}
        >
          <Icon icon="mdi:arrange-bring-to-front" />
          <span>{instance.title}</span>
        </button>
      {/each}
      {#if instances.length > 0}
        <hr class="w-full border-neutral-200 border-opacity-50" />
      {/if}
      <button
        class="item"
        disabled={instances.length >= maxInstances}
        on:click={() => {
          dispatch("spawn");
          open = false;
        }}
      >
        <Icon icon="mdi:open-in-new" class="mt-0.5" />
        <span>Open New Window</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .item {
    @apply flex items-center filter rounded-md p-1 gap-1;
  }

  .item:disabled {
    @apply text-neutral-600;
  }

  .item:not(:disabled) {
    @apply hover:text-neutral-400;
  }

  .arrow {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid rgb(23 23 23);
    @apply w-0 h-0;
  }
</style>

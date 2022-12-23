<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher } from "svelte";
  import { fade, blur, fly, slide, scale } from "svelte/transition";
  import { windowTransition } from "./consts";

  const dispatch = createEventDispatcher();

  let clazz: string = "";
  export { clazz as class };

  let headerClazz: string = "";
  export { headerClazz as headerClass };

  export let left = 100;
  export let top = 100;
  export let title: string = "Window";

  let moving = false;
  let width: number;
  let height: number;

  function onMouseDown() {
    moving = true;
  }

  function onMouseMove(e: PointerEvent) {
    // Check if mouse buttons are up
    if (e.buttons === 0) {
      moving = false;
    }

    if (moving) {
      left = Math.min(
        Math.max(left + e.movementX, 0),
        window.innerWidth - width
      );
      top = Math.min(
        Math.max(top + e.movementY, 0),
        window.innerHeight - height
      );
    }
  }

  function onMouseUp(e: PointerEvent): void {
    moving = false;
  }

  function onPointerDown(e: PointerEvent): void {
    // Don't fire a click event on clicking the control buttons
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains("ctrl-btn")
    ) {
      return;
    }

    dispatch("click");
  }

  onMount(() => {
    window.addEventListener("pointerup", onMouseUp);
    window.addEventListener("pointermove", onMouseMove);
  });

  onDestroy(() => {
    window.removeEventListener("pointerup", onMouseUp);
    window.removeEventListener("pointermove", onMouseMove);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class={clazz + " drop-shadow-md window"}
  style={`left: ${left}px; top: ${top}px; position: absolute;`}
  on:pointerdown={onPointerDown}
  transition:scale={windowTransition}
>
  <div
    class={"w-full h-8 flex items-center justify-center rounded-t-md relative drop-shadow-sm " +
      headerClazz}
    on:pointerdown={onMouseDown}
    bind:offsetWidth={width}
    bind:offsetHeight={height}
  >
    <div class="absolute right-2 top-2 flex gap-1">
      <button
        class="bg-green-500 hover:bg-green-600 ctrl-btn"
        on:click={() => dispatch("maximize")}
      />
      <button
        class="bg-yellow-500 hover:bg-yellow-600 ctrl-btn"
        on:click={() => dispatch("minimize")}
      />
      <button
        class="bg-red-500 hover:bg-red-600 ctrl-btn"
        on:click={() => dispatch("close")}
      />
    </div>
    <span class="select-none">{title}</span>
  </div>
  <div class="bg-neutral-600 rounded-b-md">
    <slot />
  </div>
</div>

<style>
  button {
    @apply rounded-full w-4 h-4;
  }
</style>

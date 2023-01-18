<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import { windowTransition } from "../consts";
  import type { WindowDef } from "../types";

  const dispatch = createEventDispatcher();

  export let appWindow: WindowDef;

  let transitioning = false;
  let moving = false;
  let width: number;
  let height: number;
  let lastX: number;
  let lastY: number;
  let container: HTMLElement;

  function startMoving() {
    setMoving(true);
  }

  function setMoving(state: boolean): void {
    if (state !== moving) {
      moving = state;
      dispatch("moving-state-changed", state);
    }
  }

  function assertPosition(movementX = 0, movementY = 0): void {
    const { width: bw, height: bh } = document.body.getBoundingClientRect();
    appWindow.left = Math.min(
      Math.max(appWindow.left + movementX, 0),
      bw - width
    );
    appWindow.top = Math.min(
      Math.max(appWindow.top + movementY, 0),
      bh - height
    );
  }

  function onMouseMove(e: PointerEvent | TouchEvent) {
    // We cannot use e.movementX as it's not consistent across browsers/machines
    let movementX: number = 0;
    let movementY: number = 0;

    // Extract a movementX & movementY value from the touch event
    let touch = e instanceof PointerEvent ? e : e.touches[0];
    if (lastX !== undefined) {
      movementX = touch.pageX - lastX;
      movementY = touch.pageY - lastY;
    }

    lastX = touch.pageX;
    lastY = touch.pageY;

    if (moving) {
      assertPosition(movementX, movementY);
    }
  }

  function onMouseUp(e: PointerEvent): void {
    setMoving(false);
  }

  function onPointerDown(e: PointerEvent): void {
    // Don't fire a click event on clicking the control buttons
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains("ctrl-btn")
    ) {
      return;
    }

    e.stopPropagation();
    dispatch("pointerdown");
  }

  onMount(() => {
    window.addEventListener("pointerup", onMouseUp);
    window.addEventListener("pointermove", onMouseMove);

    window.addEventListener("touchend", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);

    assertPosition();
    // TODO replace CSS resize with custom resize for cross-browser compatability and to have a reactive appWindow.width instead of appWindow.initialWidth
    // Set the height on mount, after that let CSS resize take over
    container.style.width = appWindow.initialWidth + "px";
    container.style.height = appWindow.initialHeight + "px";

    return () => {
      window.removeEventListener("pointerup", onMouseUp);
      window.removeEventListener("pointermove", onMouseMove);

      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
    };
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- it would be nice if the min height could be set by the content slot + 2rem but min-h-fit doesn't work and not sure how else to do it robustly 
      only scalar values seem to work?? -->
<div
  class="drop-shadow-md window fixed min-w-min overflow-hidden rounded-md grid transition-opacity min-h-[2rem]"
  class:resize={appWindow.resizable}
  class:opacity-0={appWindow.isMinimized}
  class:pointer-events-none={appWindow.isMinimized}
  style:z-index={`${appWindow.isFocused ? 30 : 20}`}
  style:left={`${appWindow.left}px`}
  style:top={`${appWindow.top}px`}
  on:pointerdown={onPointerDown}
  transition:scale={windowTransition}
  on:introstart={() => (transitioning = true)}
  on:introend={() => (transitioning = false)}
  on:outrostart={() => (transitioning = true)}
  on:outroend={() => (transitioning = false)}
  bind:this={container}
>
  <div
    class="w-full h-8 min-h-[2rem] grid justify-items-center items-center grid-cols-3 relative drop-shadow-sm px-2 min-w-max bg-neutral-700 filter"
    class:contrast-[120%]={appWindow.isFocused}
    on:pointerdown={startMoving}
    on:touchstart={startMoving}
    bind:offsetWidth={width}
    bind:offsetHeight={height}
  >
    <div class="w-full">
      <slot name="icon" />
    </div>

    <span class="select-none">{appWindow.title}</span>

    <div class="flex gap-1 w-full flex-row-reverse">
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
  </div>
  <div class="bg-neutral-600 overflow-hidden flex-1 flex flex-col">
    <slot {moving} {transitioning} name="content" />
  </div>
</div>

<style>
  button {
    @apply rounded-full w-4 h-4;
  }

  .window {
    -webkit-user-drag: none;
    grid-template-rows: min-content 1fr;
  }
</style>

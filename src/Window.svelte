<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import { windowTransition } from "./consts";

  const dispatch = createEventDispatcher();

  let clazz: string = "";
  export { clazz as class };

  let headerClazz: string = "";
  export { headerClazz as headerClass };

  export let left = 100;
  export let top = 100;
  export let windowWidth: number;
  export let windowHeight: number;
  export let title = "Window";
  export let resizable: boolean;
  export let maximized: boolean;
  export let minimized: boolean;

  let transitioning = false;

  let moving = false;
  let width: number;
  let height: number;
  let lastX: number;
  let lastY: number;

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
    left = Math.min(Math.max(left + movementX, 0), bw - width);
    top = Math.min(Math.max(top + movementY, 0), bh - height);
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

    dispatch("click");
  }

  onMount(() => {
    window.addEventListener("pointerup", onMouseUp);
    window.addEventListener("pointermove", onMouseMove);

    window.addEventListener("touchend", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);

    assertPosition();

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
  class={clazz +
    " drop-shadow-md window fixed min-w-min overflow-hidden rounded-md grid transition-opacity min-h-[2rem]"}
  class:resize={resizable}
  class:opacity-0={minimized}
  class:pointer-events-none={minimized}
  style:left={`${left}px`}
  style:top={`${top}px`}
  style:width={`${windowWidth}px`}
  style:height={`${windowHeight}px`}
  on:pointerdown={onPointerDown}
  transition:scale={windowTransition}
  on:introstart={() => (transitioning = true)}
  on:introend={() => (transitioning = false)}
  on:outrostart={() => (transitioning = true)}
  on:outroend={() => (transitioning = false)}
>
  <div
    class={"w-full h-8 min-h-[2rem] grid justify-items-center items-center grid-cols-3 relative drop-shadow-sm px-2 min-w-max " +
      headerClazz}
    on:pointerdown={startMoving}
    on:touchstart={startMoving}
    bind:offsetWidth={width}
    bind:offsetHeight={height}
  >
    <div class="w-full">
      <slot name="icon" />
    </div>

    <span class="select-none">{title}</span>

    <div class="flex gap-1 w-full flex-row-reverse">
      <button
        class="bg-green-500 hover:bg-green-600 ctrl-btn"
        on:click={() => {
          maximized = true;
        }}
      />
      <button
        class="bg-yellow-500 hover:bg-yellow-600 ctrl-btn"
        on:click={() => {
          minimized = true;
        }}
      />
      <button
        class="bg-red-500 hover:bg-red-600 ctrl-btn"
        on:click={() => dispatch("close")}
      />
    </div>
  </div>
  <div class="bg-neutral-600 flex-1 overflow-auto flex flex-col">
    <slot {transitioning} name="content" />
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

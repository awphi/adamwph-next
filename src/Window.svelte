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
  export let defaultWidth = 600;
  export let defaultHeight = 400;
  export let title = "Window";
  export let resizable = false;

  let moving = false;
  let width: number;
  let height: number;
  let lastX: number;
  let lastY: number;

  function startMoving() {
    console.log("start");
    setMoving(true);
  }

  function setMoving(state: boolean): void {
    if (state !== moving) {
      moving = state;
      dispatch("moving-state-changed", state);
    }
  }

  function onMouseMove(e: PointerEvent | TouchEvent) {
    let movementX: number = 0;
    let movementY: number = 0;

    if (e instanceof PointerEvent) {
      // Check if mouse buttons are up
      if (e.buttons === 0) {
        setMoving(false);
      }

      movementX = e.movementX;
      movementY = e.movementY;
      lastX = e.pageX;
      lastY = e.pageY;
    } else {
      // Extract a movementX & movementY value from the touch event
      const touch = e.touches[0];

      if (lastX) {
        movementX = touch.pageX - lastX;
        movementY = touch.pageY - lastY;
      }

      lastX = touch.pageX;
      lastY = touch.pageY;
    }

    console.log(movementX, movementY, moving);

    if (moving) {
      left = Math.min(Math.max(left + movementX, 0), window.innerWidth - width);
      top = Math.min(Math.max(top + movementY, 0), window.innerHeight - height);
    }
  }

  function onMouseUp(e: PointerEvent): void {
    console.log("done");
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
  });

  onDestroy(() => {
    window.removeEventListener("pointerup", onMouseUp);
    window.removeEventListener("pointermove", onMouseMove);

    window.removeEventListener("touchend", onMouseUp);
    window.removeEventListener("touchmove", onMouseMove);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- it would be nice if the min height could be set by the content slot + 2rem but min-h-fit doesn't work and not sure how else to do it robustly 
      only scalar values seem to work?? -->
<div
  class={clazz +
    " drop-shadow-md window fixed min-w-fit min-h-fit overflow-hidden rounded-md flex flex-col"}
  class:resize={resizable}
  style:left={`${left}px`}
  style:top={`${top}px`}
  style:width={`${defaultWidth}px`}
  style:height={`${defaultHeight}px`}
  style:min-height={"2rem"}
  on:pointerdown={onPointerDown}
  transition:scale={windowTransition}
>
  <div
    class={"w-full h-8 min-h-[2rem] grid justify-items-center items-center grid-cols-3 relative drop-shadow-sm px-2 " +
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
  <div class="bg-neutral-600 flex-1 overflow-auto flex flex-col">
    <slot name="content" />
  </div>
</div>

<style>
  button {
    @apply rounded-full w-4 h-4;
  }

  .window {
    -webkit-user-drag: none;
  }
</style>

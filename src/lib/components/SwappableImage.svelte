<script lang="ts">
  export let alt: string = "";
  export let src: string;
  export let width: number;
  export let height: number;
  let clazz: string = "";

  export { clazz as class };

  let lastImageUrl: string;
  let imageLoadState: "done" | "error" | "loading" = "loading";
  let imageElement: HTMLImageElement;

  $: if (imageElement) {
    // Managing the state like this should mean the image element is hidden when switching projects until the new image loads or errors
    imageLoadState = "loading";

    if (lastImageUrl !== src) {
      imageElement.src = src;
      lastImageUrl = src;
    }
  }
</script>

<!-- <img> is always mounted but is hidden when not 'done' -->
<img
  bind:this={imageElement}
  class:hidden={imageLoadState !== "done"}
  on:load={() => (imageLoadState = "done")}
  on:error={() => (imageLoadState = "error")}
  {alt}
  {height}
  {width}
  class={clazz}
/>

{#if imageLoadState === "error"}
  <slot name="error-content" />
{/if}

{#if imageLoadState === "loading"}
  <slot name="loading-content" />
{/if}

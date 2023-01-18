<script lang="ts">
  // Prism Imports
  import Prism from "prismjs";
  import "prismjs/components/prism-markdown.min.js";
  import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
  import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js";
  import "prismjs/themes/prism-okaidia.min.css";
  import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
  import { onMount } from "svelte";

  export let language: string = "js";
  export let source: string | Promise<any>;
  export let transitioning: boolean;
  let lastSource: string;

  let pre: HTMLElement;
  let code: HTMLElement;
  let container: HTMLElement;

  async function loadSource(src: string | Promise<any>): Promise<string> {
    return typeof src === "string"
      ? Promise.resolve(source)
      : src.then((m) => m.default);
  }

  async function load(codeEl: HTMLElement, preEl: HTMLElement, src: string) {
    codeEl.innerHTML = src;
    Prism.highlightAllUnder(preEl);
  }

  $: if (typeof Prism !== "undefined" && source) {
    loadSource(source).then((s) => {
      if (lastSource !== s && !transitioning) {
        load(code, pre, s);
        lastSource = s;
      }
    });
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (lastSource && !transitioning) {
        load(code, pre, lastSource);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  });
</script>

<div bind:this={container} class="flex-1 overflow-auto">
  <pre class={`line-numbers h-full language-${language}`} bind:this={pre}><code
      bind:this={code}
    /></pre>
</div>

<style>
  pre {
    margin: 0;
    border-radius: 0;
    border: 0;
    white-space: pre-wrap;
  }
</style>

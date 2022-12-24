<script lang="ts">
  // Prism Imports
  import Prism from "prismjs";
  import "prismjs/plugins/line-numbers/prism-line-numbers.js";
  import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.js";
  import "prismjs/themes/prism-okaidia.css";
  import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
  export let language: string = "js";
  export let source: string | Promise<any>;
  let lastSource: string;

  let preEl: HTMLElement;
  let codeEl: HTMLElement;

  $: if (typeof Prism !== "undefined" && source) {
    async function load() {
      const loadedSource = await (typeof source === "string"
        ? Promise.resolve(source)
        : source.then((m) => m.default));
      if (loadedSource !== lastSource) {
        codeEl.innerHTML = loadedSource;
        Prism.highlightAllUnder(preEl);

        lastSource = loadedSource;
      }
    }
    load();
  }
</script>

<div class="h-full">
  <pre
    class={`line-numbers h-full language-${language} whitespace-pre-wrap`}
    bind:this={preEl}><code bind:this={codeEl} /></pre>
</div>

<style>
  pre {
    margin: 0;
    border-radius: 0;
    border: 0;
  }
</style>

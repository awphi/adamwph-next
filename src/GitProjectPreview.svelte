<script lang="ts">
  import type { GitHubProject } from "./vendor-types";

  export let project: undefined | GitHubProject = undefined;
  export let error: Error | undefined = undefined;
  export let done: boolean = false;

  let statusString: string;
  let statusClass: string;
  $: statusString = error
    ? "Error: " + error.message
    : done
    ? "Fetched"
    : "Fetching";
  $: statusClass = error
    ? "text-red-500"
    : done
    ? "text-green-500"
    : "text-orange-400";
</script>

<div class="flex h-full flex-col">
  <div class="flex-1 py-1 px-2 relative">
    {#if project === undefined}
      <h1 class="text-2xl bold">GitHub Project Explorer</h1>
      <hr class="border-opacity-50 border-neutral-200 my-1" />
      <p>
        This app lets you explore some of my various side projects that I've
        made public on GitHub - all the source code can be viewed in the various
        linked repositories!
      </p>
      <p>
        Note that this list is dynamically updated from GitHub's public API and
        therefore is not exhaustive as I may have keep some projects
        closed-source until they're more fleshed out.
      </p>
      <p>
        To get started try clicking on one of the projects on the menu to the
        left. These are ordered chronologically by when I last pushed to them so
        the one(s) at the top are likely my current project(s).
      </p>

      <div
        class="px-2 py-1 w-fit m-auto absolute max-w-[80%] flex gap-1 left-1/2 -translate-x-1/2 bottom-2 rounded-md bg-neutral-600 contrast-125"
      >
        <span>Status: </span>
        <span
          class={"text-ellipsis overflow-x-hidden whitespace-pre " +
            statusClass}>{statusString}</span
        >
      </div>
    {/if}
    {#if project !== undefined}
      <h1 class="text-2xl bold">{project.name}</h1>
      <h2 class="italic text-sm">{project.description}</h2>

      <hr class="border-opacity-50 border-neutral-200 my-1" />
      <p>TODO - under construction, check back later!</p>
    {/if}
  </div>
</div>

<style>
  p + p {
    @apply mt-2;
  }
</style>

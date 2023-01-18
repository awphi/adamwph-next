<script lang="ts">
  import GitProjectPreview from "./GitProjectPreview.svelte";
  import Spinner from "./Spinner.svelte";
  import type { GitHubProject } from "../vendor-types";

  async function fetchProjects(url: string): Promise<GitHubProject[]> {
    // TODO look into adding a cookie policy + caching this in localStorage for a day or so?
    const res = await fetch(url);
    console.log(res);
    if (!res.ok) {
      throw Error(res.statusText);
    }
    const json = await res.json();
    json.forEach((v) => {
      v.pushed_at = Date.parse(v.pushed_at);
    });
    const projects = json.sort(function (a, b) {
      return b.pushed_at - a.pushed_at;
    });
    console.log(projects);
    return projects;
  }

  let selectedProjectIndex = -1;
  let sortedProjects = fetchProjects(
    "https://api.github.com/users/awphi/repos"
  );
</script>

<div class="flex h-full">
  {#await sortedProjects}
    <div class="left-bar items-center justify-center">
      <Spinner />
    </div>
    <div class="right-bar">
      <GitProjectPreview done={false} />
    </div>
  {:then projects}
    <div class="left-bar">
      {#each projects as proj, i}
        <button
          class="w-full flex text-left gap-1 items-center p-1 rounded-md bg-neutral-600"
          class:hover:contrast-125={selectedProjectIndex !== i}
          class:contrast-150={selectedProjectIndex === i}
          on:click={() => (selectedProjectIndex = i)}
        >
          <div
            class="bg-neutral-700 w-6 h-6 rounded-full flex items-center justify-center"
          >
            {i + 1}
          </div>
          <p class="whitespace-pre overflow-x-hidden text-ellipsis flex-1">
            {proj.name}
          </p>
        </button>
      {/each}
    </div>
    <div class="right-bar">
      <GitProjectPreview
        done={true}
        project={selectedProjectIndex !== -1
          ? projects[selectedProjectIndex]
          : undefined}
      />
    </div>
  {:catch e}
    <div class="left-bar items-center justify-center">
      <button>Retry</button>
    </div>
    <div class="right-bar"><GitProjectPreview error={e} /></div>
  {/await}
</div>

<style>
  .left-bar {
    @apply flex flex-col w-1/3 h-full overflow-y-scroll p-1;
  }

  .right-bar {
    @apply w-2/3 overflow-y-auto min-h-full;
  }
</style>

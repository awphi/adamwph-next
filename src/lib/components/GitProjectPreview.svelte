<script lang="ts">
  import type { GitHubProject } from "../vendor-types";
  import { marked } from "marked";
  import "./marked.css";

  export let project: undefined | GitHubProject = undefined;
  export let error: Error | undefined = undefined;
  export let done: boolean = false;

  let statusString: string;
  let statusClass: string;
  let imageUrl: string;
  let descriptionMarkdown: Promise<string>;

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
  $: {
    if (project !== undefined) {
      import(`../../assets/projects/images/${project.name}.png`)
        .then((a) => {
          imageUrl = a.default;
        })
        .catch(
          () =>
            (imageUrl = `https://via.placeholder.com/1920x1080.png?text=${encodeURI(
              `No image found for "${project.name}"`
            )}`)
        );
    }
  }
  $: descriptionMarkdown =
    project === undefined
      ? Promise.resolve("")
      : import(`../../assets/projects/descriptions/${project.name}.md?raw`)
          .then((r) => r.default)
          .then((t) => marked.parse(t))
          .catch(() =>
            marked.parse(
              `# What is ${project.name}? \n Could not find description for \`${project.name}\`. Please check back later once I've written one! ;)`
            )
          );
</script>

<div class="flex min-h-full flex-col">
  <div class="flex-1 py-1 px-2 relative">
    {#if project === undefined}
      <h1 class="text-2xl font-bold">GitHub Project Explorer</h1>
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
      <h1 class="text-2xl font-bold">{project.name}</h1>
      <h2 class="italic text-sm">{project.description}</h2>
      <hr class="my-2" />
      <div class="relative">
        <img src={imageUrl} alt="" class="rounded-md w-full bg-white" />
        <div
          class="rounded-tl-md absolute right-0 bottom-0 bg-neutral-600 bg-opacity-90 px-2 py-1 w-fit"
        >
          <div class="grid info-grid grid-cols-[max-content_1fr] gap-x-4 ">
            <span>Repo:</span>
            <a target="_blank" rel="noreferrer" href={project.html_url}
              >{project.name}</a
            >
            <span>Created:</span>
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
            <span>Last push:</span>
            <span>{new Date(project.pushed_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <hr class="my-2" />
      <!-- Should be very quick so don't need a spinner while loading -->
      {#await descriptionMarkdown then desc}
        <div class="marked">{@html desc}</div>
      {/await}
    {/if}
  </div>
</div>

<style>
  p + p {
    @apply mt-2;
  }

  hr {
    @apply border-opacity-50 border-neutral-200;
  }

  .info-grid > * {
    @apply even:text-right;
  }

  a {
    @apply underline hover:text-neutral-400;
  }
</style>

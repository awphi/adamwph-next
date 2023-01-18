<script lang="ts">
  import type { GitHubProject } from ".,/vendor-types";

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

<div class="flex min-h-full flex-col">
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
      <hr class="my-2" />
      <div class="relative">
        <img
          src="https://loremflickr.com/1920/1080"
          alt=""
          class="rounded-md aspect-video w-full"
        />
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

      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suscipit
        eget ipsum vitae dapibus. Mauris aliquam ultricies libero a euismod.
        Curabitur eu arcu ac mi efficitur fermentum. Suspendisse augue tellus,
        egestas ac blandit ut, gravida vel ante. Quisque non ultrices enim.
        Phasellus nec est ut est suscipit auctor. Integer eu volutpat purus.
      </p>
      <p>
        Phasellus sagittis augue nec felis varius sollicitudin. Integer cursus
        quam quis fermentum euismod. Donec tristique ipsum tristique, blandit
        diam a, pulvinar nulla. Aenean vel nulla nibh. Aenean euismod hendrerit
        euismod. Vestibulum vel felis nisl. Nunc tincidunt est vitae lectus
        blandit pulvinar. Maecenas efficitur lacus vitae sapien vulputate
        feugiat.
      </p>
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

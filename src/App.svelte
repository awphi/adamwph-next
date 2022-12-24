<script lang="ts">
  import Icon from "@iconify/svelte";
  import ConsoleWindowContent from "./ConsoleWindowContent.svelte";
  import PlaceholderWindowContent from "./PlaceholderWindowContent.svelte";
  import type { AppDef, WindowDef } from "./types";
  import Window from "./Window.svelte";

  let focusedWindow = -1;
  let isAnyWindowMoving = false;

  let apps: AppDef[] = [
    {
      name: "Terminal",
      icon: "mdi:console",
      component: ConsoleWindowContent,
      spawn() {
        return {
          title: "Terminal",
          app: apps[0],
          left: 200,
          top: 100,
        };
      },
    },
    {
      name: "Some App",
      icon: "mdi:application-outline",
      component: PlaceholderWindowContent,
      spawn() {
        return {
          title: "Some Title",
          app: apps[0],
          left: 200,
          top: 100,
          resizable: true,
          props: {
            source: import("./assets/longtest.js?raw"),
          },
        };
      },
    },
  ];

  let appWindows: WindowDef[] = [];

  // Spawn a new window and merge in the app defintin that spawned it
  function spawnFrom(app: AppDef): () => void {
    return () => {
      const appWindow = { ...app.spawn(), app: app };
      appWindows = [...appWindows, appWindow];
    };
  }
</script>

<main class="grid h-full w-full">
  <div class="flex items-center justify-center overflow-hidden">
    <!-- Disable user selection when a window is moving to prevent text dragging behaviour if some text in a window is highlighted -->
    <div class="window-container " class:select-none={isAnyWindowMoving}>
      {#each appWindows as appWindow, i}
        {#if appWindow !== null}
          <Window
            on:click={() => (focusedWindow = i)}
            on:close={() => {
              // We can't just filter out the window from the array as its position will be confused when animating
              // Setting it to null does the trick and let the gc worry about memory...
              appWindows[i] = null;
            }}
            on:moving-state-changed={({ detail }) => {
              isAnyWindowMoving = detail;
            }}
            bind:left={appWindow.left}
            bind:top={appWindow.top}
            bind:title={appWindow.title}
            resizable={appWindow.resizable}
            defaultHeight={appWindow.defaultHeight}
            defaultWidth={appWindow.defaultWidth}
            class={focusedWindow === i ? "z-10" : "z-0"}
            headerClass={"bg-neutral-700" +
              (focusedWindow === i ? " filter contrast-[110%]" : "")}
          >
            <Icon icon={appWindow.app.icon} slot="icon" />
            <svelte:component
              this={appWindow.app.component}
              {...appWindow.props}
              on:title-change={({ detail }) => (appWindow.title = detail)}
              slot="content"
            />
          </Window>
        {/if}
      {/each}
    </div>
    <div class="flex app-icon-container gap-10">
      {#each apps as app}
        <button
          class="app-icon"
          on:touchend={spawnFrom(app)}
          on:dblclick={spawnFrom(app)}
        >
          <Icon icon={app.icon} slot="icon" class="flex-1" width="84" />
          <p class="overflow-hidden w-full text-ellipsis">
            {app.name}
          </p>
        </button>
      {/each}
    </div>
  </div>
  <div class="footer">
    <div class="flex flex-col">
      <h1 class="font-bold">Adam Hodson</h1>
      <h2>Graduate Software Engineer</h2>
      <h2>ComSci Class of 2022 @ Durham University</h2>
    </div>
    <div class="flex gap-2">
      <a href="https://github.com/awphi">
        <Icon icon="mdi:github" width="96" />
      </a>

      <a href="https://www.linkedin.com/in/adam-h-a77275197/">
        <Icon icon="mdi:linkedin" width="96" /></a
      >
    </div>
  </div>
</main>

<style>
  h2 {
    @apply text-2xl;
  }

  h1 {
    @apply text-4xl;
  }

  a {
    @apply hover:text-neutral-300 text-neutral-200 pointer-events-auto;
  }

  main {
    grid-template-rows: 1fr min-content;
  }

  .app-icon {
    outline-color: rgba(229, 229, 229, 0.3);
    grid-template-rows: min-content minmax(0, 1fr);
    @apply grid overflow-hidden w-28 h-28 justify-items-center outline-1 hover:outline focus:outline rounded-sm focus:bg-blue-600 hover:bg-neutral-200 hover:bg-opacity-5 focus:bg-opacity-5 transition-colors select-none px-2;
  }

  .footer {
    @apply flex justify-between items-end select-none p-4 z-10 pointer-events-none;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0) 100%
    );
  }
</style>

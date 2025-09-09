<script lang="ts">
  import Icon from "@iconify/svelte";
  import AppIcon from "./lib/components/AppIcon.svelte";
  import { appDefs } from "./lib/apps";
  import { defaultWindowProps } from "./lib/consts";
  import type { AppDef, WindowDef } from "./lib/types";
  import Window from "./lib/components/Window.svelte";

  let isAnyWindowMoving = false;

  function spawnFrom(app: AppDef): WindowDef {
    const partial = app.spawn();
    const appWindow = { ...defaultWindowProps, ...partial, app: app };
    appWindows = [...appWindows, appWindow];
    return appWindow;
  }

  // Avoid manipulating isFocused directly - use this where possible
  function focusWindow(appWindow: WindowDef | null): void {
    appWindows.forEach((a) => {
      if (a === null) {
        return;
      }
      a.isFocused = false;
    });
    if (appWindow !== null) {
      appWindow.isFocused = true;
    }
    appWindows = appWindows;
  }

  let apps = appDefs;
  let appWindows: WindowDef[] = [];
</script>

<main
  on:pointerdown={() => focusWindow(null)}
  class="grid h-full w-full min-w-[800px]"
>
  <div class="flex items-center justify-center overflow-hidden">
    <!-- Disable user selection when a window is moving to prevent text dragging behaviour if some text in a window is highlighted -->
    <div class="window-container" class:select-none={isAnyWindowMoving}>
      {#each appWindows as appWindow, i}
        {#if appWindow !== null}
          <Window
            on:pointerdown={() => focusWindow(appWindow)}
            on:close={() => {
              // We can't just filter out the window from the array as its position will be confused when animating
              // Setting it to null does the trick and let the gc worry about memory...
              appWindows[i] = null;
            }}
            on:minimize={() => {
              appWindow.isMinimized = true;
              if (appWindow.isFocused) {
                focusWindow(null);
              }
              appWindows = appWindows;
            }}
            on:moving-state-changed={({ detail }) => {
              isAnyWindowMoving = detail;
            }}
            bind:appWindow
          >
            <Icon icon={appWindow.app.icon} slot="icon" />
            <svelte:component
              this={appWindow.app.component}
              let:transitioning
              let:moving
              {...appWindow.props}
              {transitioning}
              {moving}
              isFocused={appWindow.isFocused}
              slot="content"
            />
          </Window>
        {/if}
      {/each}
    </div>
    <div class="flex app-icon-container gap-10">
      {#each apps as app}
        <AppIcon
          {app}
          on:spawn={() => {
            const newWin = spawnFrom(app);
            focusWindow(newWin);
          }}
          on:focus={({ detail }) => {
            detail.isMinimized = false;
            focusWindow(detail);
          }}
          {appWindows}
          on:minimize-change={({ detail: { appWindow, state } }) => {
            appWindow.isMinimized = state;
            focusWindow(appWindow);
            appWindows = appWindows;
          }}
        />
      {/each}
    </div>
  </div>
  <div class="footer">
    <div class="flex flex-col">
      <h1 class="font-bold">Adam Hodson</h1>
      <h2>Software Developer</h2>
      <h2>Creating featureful, unique applications on the web.</h2>
    </div>
    <div class="flex gap-4">
      <a href="https://github.com/awphi">
        <Icon icon="mdi:github" width="56" />
      </a>

      <a href="https://www.linkedin.com/in/adam-h-a77275197/">
        <Icon icon="mdi:linkedin" width="56" /></a
      >

      <a href="https://awphos.vercel.app/">
        <Icon icon="mdi:new-box" width="56" /></a
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
    @apply hover:text-neutral-400 text-neutral-200 pointer-events-auto;
  }

  main {
    grid-template-rows: 1fr min-content;
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

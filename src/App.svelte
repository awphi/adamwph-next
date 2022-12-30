<script lang="ts">
  import Icon from "@iconify/svelte";
  import AppIcon from "./AppIcon.svelte";
  import { appDefs, defaultWindowProps } from "./apps";
  import type { AppDef, WindowDef } from "./types";
  import Window from "./Window.svelte";

  let focusedWindow = -1;
  let isAnyWindowMoving = false;

  function spawnFrom(app: AppDef): void {
    const partial = app.spawn();
    const appWindow = { ...defaultWindowProps, ...partial, app: app };
    appWindows = [...appWindows, appWindow];
    focusedWindow = appWindows.length - 1;
  }

  let apps = appDefs;
  let appWindows: WindowDef[] = [];

  // TODO clear focusedWindow when clicking on background
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main class="grid h-full w-full min-w-[800px]">
  <div class="flex items-center justify-center overflow-hidden">
    <!-- Disable user selection when a window is moving to prevent text dragging behaviour if some text in a window is highlighted -->
    <div class="window-container" class:select-none={isAnyWindowMoving}>
      {#each appWindows as appWindow, i}
        {#if appWindow !== null}
          <Window
            on:click={() => {
              focusedWindow = i;
            }}
            on:close={() => {
              // We can't just filter out the window from the array as its position will be confused when animating
              // Setting it to null does the trick and let the gc worry about memory...
              appWindows[i] = null;
              if (i === focusedWindow) {
                focusedWindow = -1;
              }
            }}
            on:moving-state-changed={({ detail }) => {
              isAnyWindowMoving = detail;
            }}
            bind:left={appWindow.left}
            bind:top={appWindow.top}
            bind:title={appWindow.title}
            bind:minimized={appWindow.isMinimized}
            bind:maximized={appWindow.isMaximized}
            bind:windowHeight={appWindow.windowHeight}
            bind:windowWidth={appWindow.windowWidth}
            resizable={appWindow.resizable}
            class={focusedWindow === i ? "z-30" : "z-20"}
            headerClass={"bg-neutral-700" +
              (focusedWindow === i ? " filter contrast-[110%]" : "")}
          >
            <Icon icon={appWindow.app.icon} slot="icon" />
            <svelte:component
              this={appWindow.app.component}
              let:transitioning
              {...appWindow.props}
              {transitioning}
              on:title-change={({ detail }) => (appWindow.title = detail)}
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
            spawnFrom(app);
            // Focus the newly opened window
            focusedWindow = appWindows.length - 1;
          }}
          on:focus={({ detail }) => {
            detail.isMinimized = false;
            focusedWindow = appWindows.findIndex((d) => d === detail);
            appWindows = appWindows;
          }}
          {appWindows}
          on:minimize-change={({ detail: { appWindow, state } }) => {
            appWindow.isMinimized = state;
            // Re-assign to tell Svelte we've updated appWindows
            appWindows = appWindows;
          }}
        />
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

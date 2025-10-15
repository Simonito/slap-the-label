<script lang="ts">
  import { createCanvasContext } from '$lib/context/canvasContext.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import ResizableAppSidebar from '$lib/components/ResizableAppSidebar.svelte';
  import Canvas from '$lib/components/Canvas.svelte';

  const ctx = createCanvasContext();

  let sidebarOpen = $state(true);

  let isMac = false;
  if (typeof navigator !== 'undefined') {
    isMac = navigator.userAgent.includes('Mac');
  }
  const ctrlCmd = isMac ? '⌘' : 'Ctrl';
</script>

<svelte:head>
  <title>YOLO Overlay Viewer</title>
</svelte:head>

<Sidebar.Provider bind:open={sidebarOpen}>
  <ResizableAppSidebar>
    <header class="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <Sidebar.Trigger {...props} />
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content
          side="bottom"
          align="start"
          alignOffset={4}
          arrowClasses="hidden"
          sideOffset={4}
        >
          Open sidebar <kbd>{ctrlCmd}</kbd> + <kbd>B</kbd>
        </Tooltip.Content>
      </Tooltip.Root>

      <div class="flex items-center gap-2">
        <h1 class="text-lg font-semibold">YOLO Overlay Viewer</h1>
      </div>
    </header>
    <div class="flex-1 overflow-auto">
      <Canvas />
    </div>
  </ResizableAppSidebar>
</Sidebar.Provider>

<style>
  kbd {
    background-color: #dfdfef;
    border-radius: 3px;
    border: 1px solid #b4b4b4;
    box-shadow:
      0 1px 1px rgb(0 0 0 / 0.2),
      0 2px 0 0 rgb(255 255 255 / 0.7) inset;
    color: #333333;
    display: inline-block;
    font-size: 0.85em;
    font-weight: 700;
    line-height: 1;
    padding: 2px 4px;
    white-space: nowrap;
  }
</style>

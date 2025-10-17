<script lang="ts">
  import * as Resizable from '$lib/components/ui/resizable';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { Download, Trash2 } from '@lucide/svelte/icons';
  import AnnotationUploader from './AnnotationUploader.svelte';
  import Controls from './Controls.svelte';
  import FileInfo from './FileInfo.svelte';
  import ImageUploader from './ImageUploader.svelte';
  import Legend from './Legend.svelte';
  import type { Snippet } from 'svelte';
  import { Button } from './ui/button';

  const open = true; // initial state

  const ctx = getCanvasContext();

  let { children }: { children: Snippet } = $props();

  let sidebarPane: ReturnType<typeof Resizable.Pane>;
  let isPaneCollapsed = $state(!open);
  let isSidebarOpen = $state(open);
  let isResizing = $state(false);

  function handlePaneCollapse() {
    isPaneCollapsed = true;
    isSidebarOpen = false;
  }

  function handlePaneExpand() {
    isPaneCollapsed = false;
    isSidebarOpen = true;
  }

  function handleClear() {
    ctx.clearAll();
  }

  function handleDownload() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'yolo-overlay.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  $effect(() => {
    if (isSidebarOpen && isPaneCollapsed) {
      return sidebarPane.expand();
    }
    if (!isSidebarOpen && !isPaneCollapsed) {
      sidebarPane.collapse();
    }
  });
</script>

<Sidebar.Provider bind:open={isSidebarOpen}>
  <Resizable.PaneGroup direction="horizontal">
    <Resizable.Pane
      defaultSize={0}
      minSize={15}
      maxSize={75}
      collapsible={true}
      class={`${!isResizing ? 'transition-discrete data-[state=closed]:duration-500 data-[state=open]:duration-300' : ''}`}
      data-state={isSidebarOpen ? 'open' : 'closed'}
      onCollapse={handlePaneCollapse}
      onExpand={handlePaneExpand}
      bind:this={sidebarPane}
    >
      <Sidebar.Root
        class="static! w-full! [contain:layout_style_paint]"
        style="min-width: 220px;"
        side="left"
      >
        <Sidebar.Header>
          <div class="flex flex-col gap-1">
            <h2 class="text-lg font-semibold text-sidebar-foreground">Controls</h2>
          </div>
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Button href="/konva">konva</Button>
            <Sidebar.GroupLabel>Files</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <div class="space-y-2 px-2">
                <ImageUploader />
                <AnnotationUploader />
                <FileInfo />
              </div>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Group>
            <Sidebar.GroupLabel>Display Settings</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <div class="px-2">
                <Controls />
              </div>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Group>
            <Sidebar.GroupContent>
              <div class="px-2">
                <Legend />
              </div>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          <Sidebar.Separator />

          <Sidebar.Group>
            <Sidebar.GroupLabel>YOLO Format</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <div class="space-y-2 px-2 text-xs text-sidebar-foreground/70">
                <code class="block rounded bg-sidebar-accent px-2 py-1.5 font-mono text-xs">
                  class x_center y_center width height
                </code>
                <p class="text-xs">
                  All values normalized (0-1). Lines starting with # are ignored.
                </p>
              </div>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <div class="space-y-2">
            <button
              onclick={handleDownload}
              disabled={!ctx.imageData}
              class="flex w-full items-center justify-center gap-2 rounded-md bg-sidebar-primary px-4 py-2 text-sm font-medium text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download class="h-4 w-4" />
              <span class="group-data-[collapsible=icon]:hidden">Download PNG</span>
            </button>
            <button
              onclick={handleClear}
              class="flex w-full items-center justify-center gap-2 rounded-md border border-sidebar-border px-4 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Trash2 class="h-4 w-4" />
              <span class="group-data-[collapsible=icon]:hidden">Clear All</span>
            </button>
          </div>
        </Sidebar.Footer>

        <Sidebar.Rail />
      </Sidebar.Root>
    </Resizable.Pane>

    <Resizable.Handle
      onDraggingChange={(isDragging) => {
        isResizing = isDragging;
      }}
    />

    <Resizable.Pane class="flex flex-col">
      {@render children()}
    </Resizable.Pane>
  </Resizable.PaneGroup>
</Sidebar.Provider>

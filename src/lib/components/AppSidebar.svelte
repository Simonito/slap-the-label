<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import ImageUploader from './ImageUploader.svelte';
  import AnnotationUploader from './AnnotationUploader.svelte';
  import FileInfo from './FileInfo.svelte';
  import Legend from './Legend.svelte';
  import Controls from './Controls.svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { Download, Trash2 } from 'lucide-svelte';
  import type { ComponentProps } from 'svelte';

  let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

  const ctx = getCanvasContext();

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
</script>

<Sidebar.Root {...restProps}>
  <Sidebar.Header>
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-semibold text-sidebar-foreground">Controls</h2>
    </div>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
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
          <p class="text-xs">All values normalized (0-1). Lines starting with # are ignored.</p>
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

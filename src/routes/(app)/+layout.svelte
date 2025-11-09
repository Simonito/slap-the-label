<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import ResizableAppSidebar from '$lib/components/app-sidebar/ResizableAppSidebar.svelte';
  import { cmdOrCtrl } from '$lib/hooks/is-mac.svelte';
  import { getContentPaneContext } from '$lib/context/contentPaneContext.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();

  const contentPaneCtx = getContentPaneContext();
</script>

<Sidebar.Provider>
  <ResizableAppSidebar>
    <header class="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      {#if contentPaneCtx.isMobile}
        <Sidebar.Trigger />
      {:else}
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
            class="bg-muted text-muted-foreground"
          >
            Open sidebar <kbd>{cmdOrCtrl}</kbd> + <kbd>B</kbd>
          </Tooltip.Content>
        </Tooltip.Root>
      {/if}

      <div class="flex items-center gap-2">
        <h1 class="text-lg font-semibold">YOLO Overlay Viewer</h1>
      </div>
    </header>

    {@render children?.()}
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

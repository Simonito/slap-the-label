<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import { createCanvasContext } from '$lib/context/canvasContext.svelte';
  import { createContentPaneContext } from '$lib/context/contentPaneContext.svelte';

  let { children }: { children?: Snippet } = $props();

  const ctx = createCanvasContext();
  const contentPaneCtx = createContentPaneContext();
</script>

<ModeWatcher />
{@render children?.()}

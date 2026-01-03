<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { History } from '@lucide/svelte';
  import NukeHistoryButton from './NukeHistoryButton.svelte';
  import HistorySortableList from './HistorySortableList.svelte';

  const ctx = getCanvasContext();
</script>

<div class="flex flex-col gap-2 p-4">
  <div
    class="mb-1 flex items-center justify-between gap-2 px-2 text-sm font-semibold text-muted-foreground"
  >
    <div class="inline-flex items-center gap-2">
      <History class="size-4" />
      <span>History</span>
    </div>
    <NukeHistoryButton />
  </div>

  {#if ctx.history.length === 0}
    <div class="px-2 text-xs text-muted-foreground italic">No history yet</div>
  {:else}
    <HistorySortableList />
  {/if}
</div>

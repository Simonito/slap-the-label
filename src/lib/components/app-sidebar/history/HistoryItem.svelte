<script lang="ts">
  import type { HistoryEntry } from '$lib/context/canvasContext.svelte';
  import { useSortable, type UseSortableInput } from '@dnd-kit-svelte/svelte/sortable';

  interface Props extends UseSortableInput {
    historyEntry: HistoryEntry;
    isOverlay?: boolean;
  }

  let { historyEntry, isOverlay = false, ...rest }: Props = $props();

  const { ref, isDragging } = useSortable(rest);
</script>

<div class="relative select-none" {@attach ref}>
  <!-- Original element - becomes invisible during drag but maintains dimensions -->
  <div class={['rd-18px bg-white p-4', { invisible: isDragging.current && !isOverlay }]}>
    {historyEntry.label}
  </div>

  <!-- Drag placeholder - set to match original dimensions -->
  {#if !isOverlay && isDragging.current}
    <div class="abs inset-0 flex items-center justify-center">
      <!-- You can put any content here for the dragging state -->
      <div
        class="bg-orange/10 rd-18px b-2 b-orange b-dashed flex h-full w-full items-center justify-center"
      >
        <!-- <span class="text-orange">Moving: {task.content}</span> -->
      </div>
    </div>
  {/if}
</div>

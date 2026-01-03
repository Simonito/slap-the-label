<script lang="ts">
  import SortableItem from './HistoryItem.svelte';
  import HistoryItemView from './HistoryItemView.svelte';
  import {
    DragDropProvider,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    type DragDropEvents,
  } from '@dnd-kit-svelte/svelte';
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { Draggable, type Data } from '@dnd-kit/abstract';

  const ctx = getCanvasContext();

  const listId = 'history-list';

  function arrayMove<T>(array: T[], from: number, to: number): T[] {
    const newArray = array.slice();
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  }

  function handleDragEnd(event: Parameters<DragDropEvents['dragend']>[0]) {
    const { operation, canceled } = event;
    if (canceled) return;

    type WithIndex<T = {}> = T & { index: number };
    type DataWithIndex = WithIndex<Draggable<Data>>;
    const operationSource = operation.source as DataWithIndex | null;

    const active = operation.target?.element;

    const parent = document.getElementById(listId);
    if (!parent) return;

    const over = parent.querySelector(`[data-history-index="${operationSource?.index}"]`);
    if (!active || !over) return;

    const activeIndex = Number(active.getAttribute('data-history-index'));
    const overIndex = Number(over.getAttribute('data-history-index'));

    const newHistory = arrayMove(ctx.history, activeIndex, overIndex);
    ctx.reorderHistory(newHistory);
  }
</script>

<DragDropProvider sensors={[KeyboardSensor, PointerSensor]} onDragEnd={handleDragEnd}>
  <div class="flex flex-col" id={listId}>
    {#each ctx.history as historyEntry, index (historyEntry.timestamp)}
      <SortableItem
        {historyEntry}
        id={historyEntry.timestamp}
        {index}
        isActive={index === ctx.historyIndex}
        isFuture={index > ctx.historyIndex}
        isFirst={index === 0}
        isLast={index === ctx.history.length - 1}
      />
    {/each}
  </div>

  <DragOverlay>
    {#snippet children(source)}
      {@const historyEntry = ctx.history.find((h) => h.timestamp === source.id)}
      {#if historyEntry}
        <HistoryItemView
          {historyEntry}
          index={0}
          isOverlay
          isActive={ctx.history[ctx.historyIndex]?.timestamp === historyEntry.timestamp}
        />
      {/if}
    {/snippet}
  </DragOverlay>
</DragDropProvider>

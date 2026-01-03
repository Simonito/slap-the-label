<script lang="ts">
  import Droppable from './Dropabble.svelte';
  import SortableItem from './HistoryItem.svelte';
  import { CollisionPriority } from '@dnd-kit/abstract';
  import {
    DragDropProvider,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
  } from '@dnd-kit-svelte/svelte';
  import { move } from '@dnd-kit/helpers';
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';

  const ctx = getCanvasContext();

  interface Todo {
    id: string;
    content: string;
  }

  const items = {
    'in-progress': [
      { id: 'task-1', content: 'Learn Svelte' },
      { id: 'task-2', content: 'Build a Kanban board' },
      { id: 'task-3', content: 'Review code' },
      { id: 'task-4', content: 'Setup project' },
    ],
    done: [],
  };

  let historyEntries = $state(ctx.history);
</script>

<DragDropProvider
  sensors={[KeyboardSensor, PointerSensor]}
  onDragOver={(event) => {
    historyEntries = move(historyEntries, event);
  }}
>
  <div class="grid gap-4 md:grid-cols-2">
    <Droppable
      class="bg-red-500 p-3 pt-6"
      id="history"
      type="column"
      accept="item"
      collisionPriority={CollisionPriority.Lowest}
    >
      <div class="grid gap-2">
        {#each historyEntries as historyEntry, index (historyEntry.timestamp)}
          <SortableItem
            {historyEntry}
            id={historyEntry.timestamp}
            index={() => index}
            type="item"
          />
        {/each}
      </div>
    </Droppable>
  </div>

  <DragOverlay>
    {#snippet children(source)}
      {@const historyEntry = historyEntries.find((todo) => todo.timestamp === source.id)!}
      <SortableItem id={historyEntry.timestamp} {historyEntry} index={0} isOverlay />
    {/snippet}
  </DragOverlay>
</DragDropProvider>

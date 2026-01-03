<script lang="ts">
  import { type HistoryEntry } from '$lib/context/canvasContext.svelte';
  import { useSortable, type UseSortableInput } from '@dnd-kit-svelte/svelte/sortable';
  import HistoryItemView from './HistoryItemView.svelte';

  interface Props extends UseSortableInput {
    historyEntry: HistoryEntry;
    index: number;
    isOverlay?: boolean;
    isActive?: boolean;
    isFuture?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
  }

  let {
    historyEntry,
    index,
    isOverlay = false,
    isActive = false,
    isFuture = false,
    isFirst = false,
    isLast = false,
    ...rest
  }: Props = $props();

  const { ref, isDragging } = useSortable({ ...rest, index: () => index });
</script>

<HistoryItemView
  {historyEntry}
  {index}
  {isOverlay}
  {isActive}
  {isFuture}
  {isFirst}
  {isLast}
  refAttachment={ref}
  isDragging={isDragging.current}
/>

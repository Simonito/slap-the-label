<script lang="ts">
  import { getCanvasContext, type HistoryActionType } from '$lib/context/canvasContext.svelte';
  import { cn } from '$lib/utils';
  import {
    History,
    Image as ImageIcon,
    ScanFace,
    FilePlus,
    FileMinus,
    Eye,
    EyeOff,
    Eraser,
    Circle,
  } from '@lucide/svelte';
  import { slide, scale } from 'svelte/transition';
  import { backOut, cubicOut, linear } from 'svelte/easing';
  import NukeHistoryButton from './NukeHistoryButton.svelte';
  import HistorySortableList from './HistorySortableList.svelte';

  const ctx = getCanvasContext();

  const TYPE_ICONS: Record<HistoryActionType | 'default', typeof ImageIcon> = {
    image: ImageIcon,
    mask: ScanFace,
    annotation: FilePlus,
    visibility: Eye,
    clear: Eraser,
    default: Circle,
  };

  function getIcon(type: HistoryActionType, label: string) {
    if (type === 'annotation') {
      return label.startsWith('Remove') ? FileMinus : FilePlus;
    }
    if (type === 'visibility') {
      return label.startsWith('Hide') ? EyeOff : Eye;
    }
    return TYPE_ICONS[type] || TYPE_ICONS.default;
  }
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

  <div class="flex flex-col">
    {#if ctx.history.length === 0}
      <div class="px-2 text-xs text-muted-foreground italic">No history yet</div>
    {/if}

    {#each ctx.history as item, i (item.timestamp)}
      {@const Icon = getIcon(item.type, item.label)}
      {@const isActive = i === ctx.historyIndex}
      {@const isFuture = i > ctx.historyIndex}

      <button
        class={cn(
          'group flex w-full items-stretch gap-3 rounded-md py-0 pr-2 text-left text-sm transition-colors',
          'hover:bg-accent/50',
          isActive && 'bg-accent font-medium text-accent-foreground dark:bg-accent/40',
        )}
        onclick={() => ctx.jumpTo(i)}
      >
        <div class="relative flex w-8 shrink-0 flex-col items-center">
          {#if i > 0 && i < ctx.historyIndex + 1}
            <div
              class="absolute top-0 h-1/2 w-px bg-muted-foreground/20 dark:bg-muted-foreground/40"
              in:slide={{ delay: 200, duration: 500, easing: backOut }}
              out:slide={{ duration: 100, axis: 'y', easing: linear }}
            ></div>
          {/if}

          {#if i < ctx.history.length - 1 && i < ctx.historyIndex}
            <div
              class="absolute top-6/12 h-1/2 w-px bg-muted-foreground/20 dark:bg-muted-foreground/40"
              in:slide={{ duration: 200, axis: 'y', easing: linear }}
              out:slide={{ delay: 100, duration: 50, easing: linear }}
            ></div>
          {/if}

          <div
            class={cn(
              'z-10 my-3 flex size-2.5 shrink-0 items-center justify-center rounded-full border bg-background transition-colors duration-300',
              isActive
                ? 'scale-110 border-primary bg-primary'
                : 'border-muted-foreground bg-muted-foreground',
              isFuture && 'opacity-50',
            )}
            in:scale={{ duration: 300, delay: 150, easing: cubicOut, start: 0 }}
          ></div>
        </div>

        <div
          class={cn(
            'flex min-w-0 items-center gap-2 py-2',
            isFuture && 'opacity-50 grayscale transition-opacity duration-300',
          )}
        >
          <Icon class="size-4 shrink-0 text-muted-foreground/70" />
          <span class="truncate">{item.label}</span>
        </div>
      </button>
    {/each}
  </div>
  <HistorySortableList />
</div>

<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { clearCanvas, drawCanvas } from '$lib/utils/canvasDrawer';

  const ctx = getCanvasContext();

  let canvasElement: HTMLCanvasElement | null = $state(null);

  $effect(() => {
    if (canvasElement) {
      if (ctx.imageData && ctx.annotations) {
        drawCanvas(canvasElement, ctx.imageData, ctx.annotations, ctx.classColors, {
          zoom: ctx.zoom,
          lineWidth: ctx.lineWidth,
          showLabels: ctx.showLabels,
        });
      } else {
        clearCanvas(canvasElement);
      }
    }
  });
</script>

<div class="flex min-h-full items-center justify-center p-8">
  {#if !ctx.imageData}
    <div class="space-y-3 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <svg
          class="h-8 w-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-medium text-foreground">No Image Loaded</h2>
        <p class="mt-1 text-sm text-muted-foreground">Upload an image to get started</p>
      </div>
    </div>
  {:else}
    <canvas
      width="800"
      height="600"
      class="h-auto max-w-full rounded-lg border border-border bg-white shadow-lg"
      bind:this={canvasElement}
    ></canvas>
  {/if}
</div>

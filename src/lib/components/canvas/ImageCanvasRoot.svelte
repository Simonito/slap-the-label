<script lang="ts">
  import ImageCanvas from '$lib/components/canvas/ImageCanvas.svelte';

  let canvasRef: ReturnType<typeof ImageCanvas> | undefined = $state();
</script>

<div class="relative">
  <div class="absolute top-0 left-0">
    {#await import('$lib/components/canvas/ImageCanvas.svelte') then { default: ImageCanvasComponent }}
      <ImageCanvasComponent bind:this={canvasRef} />
    {/await}
  </div>
</div>

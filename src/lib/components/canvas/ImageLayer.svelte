<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { Layer, Image, Group } from 'svelte-konva';
  import AnnotationRect from './AnnotationRect.svelte';

  let {
    image,
    mask,
    showMask = $bindable(true),
    maskOpacity = $bindable(0.5),
  }: {
    image: HTMLCanvasElement | HTMLImageElement | undefined;
    mask: HTMLCanvasElement | HTMLImageElement | undefined;
    showMask?: boolean;
    maskOpacity?: number;
  } = $props();

  const ctx = getCanvasContext();

  let x = $state(0);
  let y = $state(0);
  let imageRef: ReturnType<typeof Image> | undefined = $state();
  const scaleX = $derived(ctx.imageData ? ctx.imageData.width : 0);
  const scaleY = $derived(ctx.imageData ? ctx.imageData.height : 0);

  export function resetLayerOffset() {
    if (!imageRef) return;

    x = 0;
    y = 0;
  }
</script>

<Layer draggable bind:x bind:y>
  <Group>
    <Image {image} bind:this={imageRef} />
    {#if showMask && mask}
      <Image image={mask} opacity={maskOpacity} />
    {/if}
  </Group>
  <Group>
    {#each ctx.annotations as box}
      <AnnotationRect {box} {scaleX} {scaleY} showLabels />
    {/each}
  </Group>
</Layer>

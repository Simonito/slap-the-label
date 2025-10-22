<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { watch } from 'runed';
  import { Layer, Image, Group } from 'svelte-konva';
  import AnnotationRect from './AnnotationRect.svelte';
  import { getContentPaneContext } from '$lib/context/contentPaneContext.svelte';

  let {
    image,
  }: {
    image: HTMLCanvasElement | HTMLImageElement | undefined;
  } = $props();

  const ctx = getCanvasContext();
  const paneCtx = getContentPaneContext();

  let x = $state(0);
  let y = $state(0);
  let imageRef: ReturnType<typeof Image> | undefined = $state();
  const scaleX = $derived(ctx.imageData ? ctx.imageData.width : 0);
  const scaleY = $derived(ctx.imageData ? ctx.imageData.height : 0);

  function resetLayerOffset() {
    if (!imageRef) return;

    console.log('>> moving');
    if (!ctx.imageData) {
      x = 0;
      y = 0;
      return;
    }

    x = ctx.imageData.width > paneCtx.w ? 0 : (paneCtx.w - ctx.imageData.width) / 2;
    y = ctx.imageData.height > paneCtx.h ? 0 : (paneCtx.h - ctx.imageData.height) / 2;
  }

  function handleImageChange() {
    if (!ctx.imageData) {
      return;
    }
    resetLayerOffset();
  }

  watch(
    () => ctx.imageData,
    () => {
      handleImageChange();
    },
  );
</script>

<Layer draggable bind:x bind:y>
  <Group>
    <Image {image} bind:this={imageRef} />
  </Group>
  <Group>
    {#each ctx.annotations as box}
      <AnnotationRect {box} {scaleX} {scaleY} showLabels />
    {/each}
  </Group>
</Layer>

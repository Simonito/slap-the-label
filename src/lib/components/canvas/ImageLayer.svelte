<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { Layer, Image, Group } from 'svelte-konva';
  import AnnotationRect from './AnnotationRect.svelte';
  import AnnotationPolygon from './AnnotationPolygon.svelte';

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

  {#each ctx.annotationFiles as annotationFile}
    {#if annotationFile.visible}
      <Group>
        {#each annotationFile.annotations as annotation}
          {#if annotation.type === 'bbox'}
            <AnnotationRect
              box={annotation}
              {scaleX}
              {scaleY}
              showLabels={ctx.drawSettings.showLabels}
              color={annotationFile.color}
            />
          {:else if annotation.type === 'polygon'}
            <AnnotationPolygon
              polygon={annotation}
              {scaleX}
              {scaleY}
              showLabels={ctx.drawSettings.showLabels}
              color={annotationFile.color}
            />
          {/if}
        {/each}
      </Group>
    {/if}
  {/each}
</Layer>

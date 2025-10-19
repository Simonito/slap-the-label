<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { watch } from 'runed';
  import { Layer, Image, Group } from 'svelte-konva';
  import AnnotationRect from './AnnotationRect.svelte';

  let { image }: { image: HTMLCanvasElement | HTMLImageElement | undefined } = $props();

  const ctx = getCanvasContext();
  let x = $state(0);
  let y = $state(0);
  let showLabels = $state(true);
  let imageRef: ReturnType<typeof Image> | undefined = $state();

  let imageW = $state(0);
  let imageH = $state(0);
  const scaleX = $derived(imageW);
  const scaleY = $derived(imageH);
  watch(
    () => imageRef,
    () => {
      if (!imageRef) {
        return;
      }
      imageW = imageRef.node.getWidth();
      imageH = imageRef.node.getHeight();
    },
  );
</script>

<pre>x: {x} | y: {y}</pre>
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

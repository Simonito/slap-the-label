<script lang="ts">
  import ImageCanvas from '$lib/components/canvas/ImageCanvas.svelte';
  import { onMount } from 'svelte';

  let imageCanvas: typeof ImageCanvas;

  onMount(async () => {
    // Dynamically import your canvas component encapsulating all svelte-konva functionality inside onMount()
    imageCanvas = (await import('$lib/components/canvas/ImageCanvas.svelte')).default;
  });
</script>

<svelte:component this={imageCanvas} />

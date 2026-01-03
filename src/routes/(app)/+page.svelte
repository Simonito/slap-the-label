<script lang="ts">
  import { getContentPaneContext } from '$lib/context/contentPaneContext.svelte';
  import ImageCanvasRoot from '$lib/components/canvas/ImageCanvasRoot.svelte';
  import WallpaperPattern from '$lib/components/WallpaperPattern.svelte';

  const contentPaneCtx = getContentPaneContext();
</script>

<svelte:head>
  <title>Slap The Label</title>
</svelte:head>

<WallpaperPattern>
  <div class="flex size-full items-center justify-center">
    <div
      class="size-full max-h-[700px] max-w-[1000px]"
      bind:clientWidth={contentPaneCtx.w}
      bind:clientHeight={contentPaneCtx.h}
    >
      <ImageCanvasRoot />
    </div>
  </div>
</WallpaperPattern>

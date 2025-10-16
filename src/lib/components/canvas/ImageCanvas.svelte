<script lang="ts">
  import { getContentPaneContext } from '$lib/context/contentPaneContext.svelte';
  import { Stage, Layer, Rect } from 'svelte-konva';

  const contentPane = getContentPaneContext();
  const bgColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--background')
    .trim();
</script>

<Stage width={contentPane.w} height={contentPane.h}>
  <Layer>
    <Rect
      x={0}
      y={0}
      height={contentPane.h}
      width={contentPane.w}
      fill={bgColor}
      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
      fillLinearGradientEndPoint={{ x: contentPane.w, y: contentPane.h }}
      fillLinearGradientColorStops={[0, 'yellow', 0.5, 'blue', 0.6, 'rgba(0, 0, 0, 0)']}
      listening={false}
    />
  </Layer>
</Stage>

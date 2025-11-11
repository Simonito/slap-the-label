<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import type { BBoxAnnotation } from '$lib/types';
  import { Rect, Text } from 'svelte-konva';

  let {
    box,
    scaleX,
    scaleY,
    showLabels,
    color = 'red',
  }: {
    box: BBoxAnnotation;
    scaleX: number;
    scaleY: number;
    showLabels: boolean;
    color?: string;
  } = $props();

  const ctx = getCanvasContext();
</script>

<Rect
  x={box.x * scaleX - (box.w * scaleX) / 2}
  y={box.y * scaleY - (box.h * scaleY) / 2}
  width={box.w * scaleX}
  height={box.h * scaleY}
  stroke={color}
  strokeWidth={ctx.drawSettings.lineWidth}
  perfectDrawEnabled={false}
  shadowForStrokeEnabled={false}
/>
{#if showLabels && box.class}
  <Text
    x={box.x * scaleX - (box.w * scaleX) / 2}
    y={box.y * scaleY - (box.h * scaleY) / 2 - 18}
    text={box.class}
    fontSize={14}
    fill="white"
    stroke="black"
    strokeWidth={0.5}
    listening={false}
  />
{/if}

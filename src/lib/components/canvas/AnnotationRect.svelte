<script lang="ts">
  import type { Annotation } from '$lib/types';
  import { Rect, Text } from 'svelte-konva';

  let {
    box,
    scaleX,
    scaleY,
    showLabels,
  }: {
    box: Annotation;
    scaleX: number;
    scaleY: number;
    showLabels: boolean;
  } = $props();
</script>

<Rect
  x={box.x * scaleX - (box.w * scaleX) / 2}
  y={box.y * scaleY - (box.h * scaleY) / 2}
  width={box.w * scaleX}
  height={box.h * scaleY}
  stroke="red"
  strokeWidth={2}
/>
{#if showLabels && box.class}
  <Text
    x={box.x * scaleX - (box.w * scaleX) / 2}
    y={box.y * scaleY - (box.h * scaleY) / 2 - 18}
    text={box.class}
    fontSize={14}
    fill="white"
  />
{/if}

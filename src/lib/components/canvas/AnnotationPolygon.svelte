<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import type { PolygonAnnotation } from '$lib/types';
  import { watch } from 'runed';
  import { Line, Text } from 'svelte-konva';

  let {
    polygon,
    scaleX,
    scaleY,
    showLabels,
    color = 'blue',
  }: {
    polygon: PolygonAnnotation;
    scaleX: number;
    scaleY: number;
    showLabels: boolean;
    color?: string;
  } = $props();

  const id = $props.id();

  const ctx = getCanvasContext();

  let strokeWidth = $state(12);

  // scale polygon points to image dimensions
  const scaledPoints = $derived(
    polygon.points.map((coord, idx) => (idx % 2 === 0 ? coord * scaleX : coord * scaleY)),
  );

  const centroid = $derived(() => {
    if (!showLabels || !polygon.class) {
      return { x: 0, y: 0 };
    }
    let sumX = 0,
      sumY = 0,
      count = 0;
    for (let i = 0; i < scaledPoints.length; i += 2) {
      sumX += scaledPoints[i];
      sumY += scaledPoints[i + 1];
      count++;
    }
    return { x: sumX / count, y: sumY / count };
  });

  // watch(
  //   () => ctx.drawSettings.lineWidth,
  //   () => console.log('lwch'),
  // );

  const displayColor = $derived.by(() => {
    if (!polygon.properties) {
      return color;
    }

    let hasColorProp =
      'classification' in polygon.properties && 'color' in polygon.properties['classification'];
    if (!hasColorProp) {
      return color;
    }

    const [r, g, b] = polygon.properties['classification']['color'];
    return `rgb(${r}, ${g}, ${b})`;
  });
</script>

<Line
  points={scaledPoints}
  stroke={displayColor}
  strokeWidth={ctx.drawSettings.lineWidth}
  closed={true}
  opacity={0.5}
  listening={true}
  perfectDrawEnabled={false}
  shadowForStrokeEnabled={false}
  strokeScaleEnabled={true}
/>
<Text
  x={centroid().x - 20}
  y={centroid().y - 10}
  text="aaaaa"
  fontSize={14}
  fill="white"
  stroke="black"
  strokeWidth={0.5}
  listening={false}
/>
{#if showLabels && polygon.class}
  <Text
    x={centroid().x - 20}
    y={centroid().y - 10}
    text={polygon.class}
    fontSize={14}
    fill="white"
    stroke="black"
    strokeWidth={0.5}
    listening={false}
  />
{/if}

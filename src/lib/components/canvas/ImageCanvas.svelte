<script lang="ts">
  import { Stage, Layer, Rect } from 'svelte-konva';

  let innerWidth: number = $state(0);
  let innerHeight: number = $state(0);
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Stage width={innerWidth} height={innerHeight}>
  <Layer>
    <Rect x={100} y={100} width={400} height={200} fill="blue" />
  </Layer>
</Stage>

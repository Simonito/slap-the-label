<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { Layer, Image, Group } from 'svelte-konva';

  const ctx = getCanvasContext();
</script>

<Layer>
  <Group draggable={true}>
    <Image image={ctx.imageData?.img} />
  </Group>
</Layer>

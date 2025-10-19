<script lang="ts">
  import { Layer, Image, Group } from 'svelte-konva';

  let { image }: { image: HTMLCanvasElement | HTMLImageElement | undefined } = $props();
</script>

<Layer>
  <Group draggable={true}>
    <Image {image} />
  </Group>
</Layer>

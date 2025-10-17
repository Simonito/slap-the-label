<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { getContentPaneContext } from '$lib/context/contentPaneContext.svelte';
  import { loadImage } from '$lib/utils/imageLoader';
  import { watchOnce } from 'runed';
  import { onDestroy, onMount } from 'svelte';
  import { Stage } from 'svelte-konva';
  import ImageLayer from './ImageLayer.svelte';

  const contentPaneCtx = getContentPaneContext();
  const canvasCtx = getCanvasContext();
  let isMounted = $state(false);

  let stageRef: ReturnType<typeof Stage> | undefined = $state();
  let isDraggingOver = $state(false);

  let droppedFiles: Array<File> = $state([]);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDraggingOver = true;
  }
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDraggingOver = false;
  }
  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDraggingOver = false;
    if (e.dataTransfer?.files) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (e.dataTransfer.files[i]) {
          const file = e.dataTransfer.files[0];
          // droppedFiles.push(e.dataTransfer.files[0]);
          try {
            const imageData = await loadImage(file);
            canvasCtx.setImage(imageData, file.name);
          } catch (error) {
            alert('Failed to load image: ' + (error as Error).message);
          }
        }
      }
    }
    if (droppedFiles) {
      console.log('Dropped files:', $state.snapshot(droppedFiles));
    }
  }

  watchOnce(
    () => stageRef,
    () => {
      if (!stageRef) {
        return;
      }
      const stage = stageRef.node;
      const container = stage.container();

      container.addEventListener('dragover', handleDragOver);
      container.addEventListener('dragleave', handleDragLeave);
      container.addEventListener('drop', handleDrop);

      const scaleBy = 1.0337;
      stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) {
          return;
        }

        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
          direction = -direction;
        }

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
      });
    },
  );

  onMount(() => {
    isMounted = true;
  });
  onDestroy(() => {
    if (!stageRef) {
      return;
    }
    const container = stageRef.node.container();
    container.removeEventListener('dragover', handleDragOver);
    container.removeEventListener('dragleave', handleDragLeave);
    container.removeEventListener('drop', handleDrop);
  });
</script>

<div class="relative">
  <div
    class="absolute top-0 left-0 overflow-hidden rounded-2xl border border-foreground/10 bg-background"
    class:drop-highlight={isDraggingOver}
    style={`
      width: ${contentPaneCtx.w}px;
      height: ${contentPaneCtx.h}px;
    `}
  >
    <!-- prevent SSR issues by dynamically rendering konva's components (and ours that are using konva) -->
    {#if isMounted}
      <Stage bind:this={stageRef} width={contentPaneCtx.w} height={contentPaneCtx.h}>
        <ImageLayer />
      </Stage>
    {/if}
  </div>
</div>

<style>
  .drop-highlight {
    outline: 1.5px dashed var(--color-primary);
    outline-offset: -3px;
  }
</style>

<script lang="ts">
  import { UploadIcon } from '@lucide/svelte';
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { loadImage } from '$lib/utils/imageLoader';
  import { cn } from '$lib/utils';

  let {
    class: className,
  }: {
    class?: string;
  } = $props();

  const ctx = getCanvasContext();

  async function handleUploadFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imageData = await loadImage(file);
      ctx.setImage(imageData, file.name);
    } catch (error) {
      alert('Failed to load image: ' + (error as Error).message);
    }
  }
</script>

<div class={cn(className, 'flex size-full flex-col items-center justify-center gap-2 p-6')}>
  <div class="flex flex-col place-items-center justify-center gap-2">
    <div
      class="flex size-14 place-items-center justify-center rounded-full border border-dashed border-border text-muted-foreground"
    >
      <label class="h-fit rounded-full p-3 hover:bg-muted">
        <UploadIcon class="size-7" />
        <span class="sr-only text-sm font-medium">Upload Image</span>
        <input
          type="file"
          accept="image/*,.tif,.tiff"
          onchange={handleUploadFileChange}
          class="hidden"
        />
      </label>
    </div>
    <div class="flex flex-col gap-0.5 text-center">
      <span class="font-medium text-muted-foreground">
        Drag 'n' drop files here, or click to select files
      </span>
    </div>
  </div>
</div>

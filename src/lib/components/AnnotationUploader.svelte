<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { parseYoloFile, generateClassColors } from '$lib/utils/yoloParser';

  const ctx = getCanvasContext();
  let fileInputElement: HTMLInputElement | null = null;

  $effect(() => {
    if (!ctx.annotations || ctx.annotations.length === 0) {
      if (fileInputElement) {
        fileInputElement.value = '';
      }
    }
  });

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const annotations = parseYoloFile(text);
      const colors = generateClassColors(annotations);
      ctx.setAnnotations(annotations, file.name, colors);
    } catch (error) {
      alert('Failed to load annotations: ' + (error as Error).message);
    }
  }
</script>

<!-- Updated button styling for cleaner sidebar design -->
<label
  class="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-muted px-4 py-2.5 text-foreground transition-colors hover:bg-muted/80"
>
  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
  <span class="text-sm font-medium">Choose YOLO .txt</span>
  <input
    type="file"
    bind:this={fileInputElement}
    accept=".txt"
    onchange={handleFileChange}
    class="hidden"
  />
</label>

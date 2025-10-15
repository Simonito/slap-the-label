<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte'

  const ctx = getCanvasContext();
</script>

<!-- Cleaner legend display for sidebar -->
<div>
  <h2 class="text-sm font-semibold text-foreground mb-3">Classes</h2>
  {#if ctx.classColors.size > 0}
    <div class="space-y-2">
      {#each Array.from(ctx.classColors.entries()) as [cls, color]}
        <div class="flex items-center gap-2 text-sm">
          <div class="w-3 h-3 rounded-sm flex-shrink-0" style="background-color: {color}"></div>
          <span class="text-foreground">Class {cls}</span>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-sm text-muted-foreground">No classes detected</p>
  {/if}
</div>

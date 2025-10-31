<script lang="ts">
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';

  const ctx = getCanvasContext();
</script>

<div>
  <h2 class="mb-3 text-sm font-semibold text-foreground">Classes</h2>
  {#if ctx.classColors.size > 0}
    <div class="space-y-2">
      {#each Array.from(ctx.classColors.entries()) as [cls, color]}
        <div class="flex items-center gap-2 text-sm">
          <div class="h-3 w-3 flex-shrink-0 rounded-sm" style="background-color: {color}"></div>
          <span class="text-foreground">Class {cls}</span>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-sm text-muted-foreground">No classes detected</p>
  {/if}
</div>

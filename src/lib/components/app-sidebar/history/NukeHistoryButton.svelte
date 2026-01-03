<script>
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { Trash2 } from '@lucide/svelte';

  const ctx = getCanvasContext();
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button {...props} onclick={() => ctx.clearHistory()} variant="outline" size="icon-sm">
        <Trash2 class="size-3" />
      </Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>Clear history</Tooltip.Content>
</Tooltip.Root>

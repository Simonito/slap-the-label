<script lang="ts">
  import type { WithChildren } from 'bits-ui';
  import { mode } from 'mode-watcher';

  let { children }: WithChildren = $props();

  let lineVisibility = $derived(mode.current === 'dark' ? '20%' : '60%');
  let smudgeReach = $derived(mode.current === 'dark' ? '30%' : '60%');
</script>

<div class="relative h-full w-full bg-background p-2">
  <div
    class="absolute inset-0 z-0"
    style={`
      background: var(--background);
      background-image:
        linear-gradient(to right, color-mix(in oklch, var(--secondary) ${lineVisibility}, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in oklch, var(--secondary) ${lineVisibility}, transparent) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, color-mix(in oklch, var(--primary) 10%, transparent) ${smudgeReach}, transparent 80%);
      background-size: 32px 32px, 32px 32px, 100% 100%;
    `}
  ></div>

  <div class="flex size-full items-center justify-center border-2 border-red-500">
    {@render children?.()}
  </div>
</div>

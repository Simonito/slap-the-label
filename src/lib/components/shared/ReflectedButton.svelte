<script lang="ts">
  import Button, { type ButtonProps } from '../ui/button/button.svelte';

  let { children, onclick, ...rest }: ButtonProps = $props();
</script>

<Button
  type="button"
  {onclick}
  variant="secondary"
  class="relative flex w-full max-w-80 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-border bg-secondary px-4 py-5 text-foreground transition-colors hover:bg-secondary/70"
  {...rest}
>
  <div
    class="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-b from-primary/30 to-transparent opacity-70 transition-opacity duration-200 hover:opacity-90 dark:from-white/10"
  ></div>

  <div
    class="pointer-events-none absolute inset-0 rounded-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
  ></div>

  {@render children?.()}
</Button>

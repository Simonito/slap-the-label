<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar';
  import ResizableAppSidebar from '$lib/components/app-sidebar/ResizableAppSidebar.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<Sidebar.Provider>
  <ResizableAppSidebar>
    {@render children?.()}
  </ResizableAppSidebar>
</Sidebar.Provider>

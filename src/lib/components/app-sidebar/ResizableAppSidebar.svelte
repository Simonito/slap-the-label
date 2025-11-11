<script lang="ts">
  import * as Resizable from '$lib/components/ui/resizable';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { getCanvasContext } from '$lib/context/canvasContext.svelte';
  import { getContentPaneContext } from '$lib/context/contentPaneContext.svelte';
  import LucideBanana from '@lucide/svelte/icons/banana';
  import type { Snippet } from 'svelte';
  import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';
  import NavUser from './NavUser.svelte';
  import { page } from '$app/state';
  import { LucideTestTube, type Icon as IconType } from '@lucide/svelte';
  import { resolve } from '$app/paths';
  import type { RouteId } from '$app/types';
  import type { Pathname } from '$app/types';

  const INITIAL_OPEN = true;
  const MIN_PIXEL_SIZE = 220;

  const ctx = getCanvasContext();
  const paneCtx = getContentPaneContext();

  let { children }: { children: Snippet } = $props();

  let sidebarPane: ReturnType<typeof Resizable.Pane>;
  let isPaneCollapsed = $state(!INITIAL_OPEN);
  let isSidebarOpen = $state(INITIAL_OPEN);
  let isResizing = $state(false);
  let innerWidth = $state(0);

  const sidebarDefaultSize = $derived(
    paneCtx.isMobile ? 0 : Math.round((MIN_PIXEL_SIZE / innerWidth) * 100),
  );

  type MenuItems = {
    routeId: RouteId | Pathname;
    text: string;
    icon: typeof IconType;
  };
  const MENU_ITEMS: MenuItems[] = [
    {
      routeId: '/(app)',
      text: 'Slap the Label',
      icon: LucideBanana,
    },
    {
      routeId: '/(app)/test',
      text: 'Test',
      icon: LucideTestTube,
    },
  ];

  function handlePaneCollapse() {
    isPaneCollapsed = true;
    isSidebarOpen = false;
  }

  function handlePaneExpand() {
    isPaneCollapsed = false;
    isSidebarOpen = true;
  }

  function handleClear() {
    ctx.clearAll();
  }

  function handleDownload() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'yolo-overlay.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  $effect(() => {
    if (isSidebarOpen && isPaneCollapsed) {
      return sidebarPane.expand();
    }
    if (!isSidebarOpen && !isPaneCollapsed) {
      sidebarPane.collapse();
    }
  });
</script>

<svelte:window bind:innerWidth />

<Sidebar.Provider bind:open={isSidebarOpen}>
  <Resizable.PaneGroup direction="horizontal">
    <Resizable.Pane
      defaultSize={sidebarDefaultSize}
      minSize={10}
      maxSize={50}
      collapsible={true}
      class={`${!isResizing ? 'transition-discrete data-[state=closed]:duration-500 data-[state=open]:duration-300' : ''}`}
      data-state={isSidebarOpen ? 'open' : 'closed'}
      onCollapse={handlePaneCollapse}
      onExpand={handlePaneExpand}
      bind:this={sidebarPane}
    >
      <Sidebar.Root
        class="static! w-full! [contain:layout_style_paint]"
        style="min-width: {MIN_PIXEL_SIZE}px;"
        side="left"
      >
        <Sidebar.Header>
          <LightSwitch />
        </Sidebar.Header>

        <Sidebar.Content>
          <div class="h-1 w-full"></div>

          <Sidebar.Group class="group-data-[collapsible=icon]:hidden">
            <Sidebar.Menu>
              {#each MENU_ITEMS as menuItem}
                <Sidebar.MenuItem>
                  {@const isCurrent = page.route.id && menuItem.routeId === page.route.id}
                  <Sidebar.MenuButton
                    class={`max-w-[20rem] border-border px-2 py-5 ${isCurrent ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground' : ''}`}
                  >
                    {#snippet child({ props })}
                      <a href={resolve(menuItem.routeId)} {...props}>
                        <menuItem.icon />
                        <span>{menuItem.text}</span>
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <NavUser user={{ name: 'aa', email: 'my@mail.com', avatar: '/favicon.svg' }} />
        </Sidebar.Footer>

        <Sidebar.Rail />
      </Sidebar.Root>
    </Resizable.Pane>

    <Resizable.Handle
      onDraggingChange={(isDragging) => {
        isResizing = isDragging;
      }}
    />

    <Resizable.Pane class="flex flex-col">
      {@render children()}
    </Resizable.Pane>
  </Resizable.PaneGroup>
</Sidebar.Provider>

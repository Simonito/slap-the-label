import { setContext, getContext } from 'svelte';

const CONTEXT_KEY = Symbol('CONTENT_PANE');

export function createContentPaneContext() {
  let w = $state(0);
  let h = $state(0);

  const context = {
    get w() {
      return w;
    },
    get h() {
      return h;
    },

    set w(val: number) {
      w = val;
    },
    set h(val: number) {
      h = val;
    },
  };

  setContext(CONTEXT_KEY, context);
  return context;
}

export function getContentPaneContext() {
  return getContext<ReturnType<typeof createContentPaneContext>>(CONTEXT_KEY);
}

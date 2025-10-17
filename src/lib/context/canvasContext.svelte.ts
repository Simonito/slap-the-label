import { setContext, getContext } from 'svelte';
import type { Annotation, ImageData } from '$lib/types';

const CONTEXT_KEY = Symbol('CANVAS');

export function createCanvasContext() {
  let imageData = $state<ImageData | null>(null);
  let imageFileName = $state<string>('');
  let annotations = $state<Annotation[]>([]);
  let annotationFileName = $state<string>('');
  let classColors = $state<Map<string, string>>(new Map());
  let lineWidth = $state<number>(2);
  let showLabels = $state<boolean>(true);

  const context = {
    get imageData() {
      return imageData;
    },
    get imageFileName() {
      return imageFileName;
    },
    get annotations() {
      return annotations;
    },
    get annotationFileName() {
      return annotationFileName;
    },
    get classColors() {
      return classColors;
    },
    get lineWidth() {
      return lineWidth;
    },
    get showLabels() {
      return showLabels;
    },

    setImage(data: ImageData, name: string) {
      this.clearAll();
      imageData = data;
      imageFileName = name;
    },

    setAnnotations(data: Annotation[], name: string, colors: Map<string, string>) {
      annotations = data;
      annotationFileName = name;
      classColors = colors;
    },

    setLineWidth(value: number) {
      lineWidth = value;
    },

    setShowLabels(value: boolean) {
      showLabels = value;
    },

    clearAll() {
      imageData = null;
      imageFileName = '';
      annotations = [];
      annotationFileName = '';
      classColors = new Map();
      lineWidth = 2;
      showLabels = true;
    },
  };

  setContext(CONTEXT_KEY, context);
  return context;
}

export function getCanvasContext() {
  return getContext<ReturnType<typeof createCanvasContext>>(CONTEXT_KEY);
}

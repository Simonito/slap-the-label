import { setContext, getContext } from 'svelte';
import type { DrawSettings, ImageData, AnnotationFile } from '$lib/types';

const CONTEXT_KEY = Symbol('CANVAS');

export function createCanvasContext() {
  let imageData = $state<ImageData | null>(null);
  let imageFileName = $state<string>('');

  let maskData = $state<ImageData | null>(null);
  let annotationFiles = $state<AnnotationFile[]>([]);
  let classColors = $state<Map<string, string>>(new Map());

  let drawSettings = $state<DrawSettings>({ lineWidth: 2, showLabels: true });

  const context = {
    get imageData() {
      return imageData;
    },
    get imageFileName() {
      return imageFileName;
    },
    get maskData() {
      return maskData;
    },
    get annotationFiles() {
      return annotationFiles;
    },
    get classColors() {
      return classColors;
    },
    get drawSettings() {
      return drawSettings;
    },

    addAnnotationFile(file: AnnotationFile) {
      annotationFiles.push(file);
    },
    toggleAnnotationFile(fileName: string) {
      const file = annotationFiles.find((f) => f.name === fileName);
      if (file) file.visible = !file.visible;
    },
    removeAnnotationFile(fileName: string) {
      annotationFiles = annotationFiles.filter((f) => f.name !== fileName);
    },

    setImage(data: ImageData, name: string) {
      this.clearAll();
      imageData = data;
      imageFileName = name;
    },

    setMask(data: ImageData) {
      maskData = data;
    },

    setLineWidth(value: number) {
      drawSettings.lineWidth = value;
    },

    setShowLabels(value: boolean) {
      drawSettings.showLabels = value;
    },

    clearAll() {
      imageData = null;
      imageFileName = '';
      maskData = null;
      annotationFiles = [];
      classColors = new Map();
      drawSettings.lineWidth = 2;
      drawSettings.showLabels = true;
    },
  };

  setContext(CONTEXT_KEY, context);
  return context;
}

export type CanvasContext = ReturnType<typeof createCanvasContext>;

export function getCanvasContext() {
  return getContext<CanvasContext>(CONTEXT_KEY);
}

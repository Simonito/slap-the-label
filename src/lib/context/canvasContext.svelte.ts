import { setContext, getContext } from 'svelte';
import type { DrawSettings, ImageData, AnnotationFile } from '$lib/types';

const CONTEXT_KEY = Symbol('CANVAS');

export type HistoryActionType = 'image' | 'mask' | 'annotation' | 'visibility' | 'clear';

export interface HistoryEntry {
  type: HistoryActionType;
  label: string;
  state: {
    imageData: ImageData | null;
    imageFileName: string;
    maskData: ImageData | null;
    annotationFiles: AnnotationFile[];
    classColors: Map<string, string>;
  };
  timestamp: number;
}

export function createCanvasContext() {
  let imageData = $state<ImageData | null>(null);
  let imageFileName = $state<string>('');

  let maskData = $state<ImageData | null>(null);
  let annotationFiles = $state<AnnotationFile[]>([]);
  let classColors = $state<Map<string, string>>(new Map());

  let stageSettings = $state<{ zoomX: number; zoomY: number }>({ zoomX: 1, zoomY: 1 });
  let drawSettings = $state<DrawSettings>({ lineWidth: 2, showLabels: true });

  // History state
  let history = $state<HistoryEntry[]>([]);
  let historyIndex = $state<number>(-1);

  function createSnapshot(): HistoryEntry['state'] {
    return {
      imageData,
      imageFileName,
      maskData,
      // Shallow copy of the array and the file objects to preserve visibility state
      // without duplicating the heavy 'annotations' data if strictly necessary.
      // However, to be safe against mutations, we spread the object.
      // Note: If we ever mutate 'annotations' content itself, we'd need deeper cloning.
      annotationFiles: annotationFiles.map((f) => ({ ...f })),
      classColors: new Map(classColors),
    };
  }

  function applySnapshot(snapshot: HistoryEntry['state']) {
    imageData = snapshot.imageData;
    imageFileName = snapshot.imageFileName;
    maskData = snapshot.maskData;
    // Clone again to ensure we don't mutate the snapshot via the current state proxy
    annotationFiles = snapshot.annotationFiles.map((f) => ({ ...f }));
    classColors = new Map(snapshot.classColors);
  }

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
    get history() {
      return history;
    },
    get historyIndex() {
      return historyIndex;
    },

    addToHistory(type: HistoryActionType, label: string) {
      // Remove any future history if we are in the middle of the stack
      if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
      }

      const snapshot = createSnapshot();
      history.push({
        type,
        label,
        state: snapshot,
        timestamp: Date.now(),
      });
      historyIndex = history.length - 1;
    },

    undo() {
      if (historyIndex > 0) {
        historyIndex--;
        applySnapshot(history[historyIndex].state);
      } else if (historyIndex === 0) {
        // Option: allow undoing to "empty" state?
        // For now, let's treat index 0 as the oldest state.
        // Ideally we might want an 'Initial' state.
        // If we want to clear everything, we effectively go back to start.
        // Let's assume index 0 is a valid state we want to stay at.
      }
    },

    redo() {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        applySnapshot(history[historyIndex].state);
      }
    },

    jumpTo(index: number) {
      if (index >= 0 && index < history.length) {
        historyIndex = index;
        applySnapshot(history[index].state);
      }
    },

    addAnnotationFile(file: AnnotationFile) {
      annotationFiles.push(file);
      this.addToHistory('annotation', `Add ${file.name}`);
    },

    toggleAnnotationFile(fileName: string) {
      const file = annotationFiles.find((f) => f.name === fileName);
      if (file) {
        file.visible = !file.visible;
        this.addToHistory('visibility', `${file.visible ? 'Show' : 'Hide'} ${fileName}`);
      }
    },

    removeAnnotationFile(fileName: string) {
      annotationFiles = annotationFiles.filter((f) => f.name !== fileName);
      this.addToHistory('annotation', `Remove ${fileName}`);
    },

    setImage(data: ImageData, name: string) {
      // This is a "Reset" or "Load New" kind of action usually.
      // But we can treat it as part of history.
      this.clearAll(false); // don't record clearAll in history explicitly if we are about to set image
      imageData = data;
      imageFileName = name;
      this.addToHistory('image', 'Load Image');
    },

    setMask(data: ImageData) {
      maskData = data;
      this.addToHistory('mask', 'Load Mask');
    },

    setLineWidth(value: number) {
      drawSettings.lineWidth = value;
    },

    setShowLabels(value: boolean) {
      drawSettings.showLabels = value;
    },

    recalculateLineStroke(zoomX: number, zoomY: number) {
      drawSettings.lineWidth = calculateStrokeWitdth(zoomX, zoomY);
    },

    clearAll(recordHistory = true) {
      imageData = null;
      imageFileName = '';
      maskData = null;
      annotationFiles = [];
      classColors = new Map();
      drawSettings.lineWidth = 2;
      drawSettings.showLabels = true;

      if (recordHistory) {
        this.addToHistory('clear', 'Clear All');
      }
    },

    clearHistory() {
      history = [];
      historyIndex = -1;
    },
  };

  setContext(CONTEXT_KEY, context);
  return context;
}

function calculateStrokeWitdth(stageZoomX: number, stageZoomY: number) {
  const DEFAULT_SIZE = 1.5;
  const zoom = stageZoomX * stageZoomY;

  const boost = Math.min(1 / zoom, 10);

  return Math.max(DEFAULT_SIZE, DEFAULT_SIZE * boost);
}

export type CanvasContext = ReturnType<typeof createCanvasContext>;

export function getCanvasContext() {
  return getContext<CanvasContext>(CONTEXT_KEY);
}

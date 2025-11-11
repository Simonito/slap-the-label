import { browser } from '$app/environment';
import type { CanvasContext } from '$lib/context/canvasContext.svelte';
import { processGeoJsonFile } from './geojsonLoader';
import { processImageFile } from './imageLoader';
import { processTextFile } from './textLoader';

export async function loadFile(file: File, ctx: CanvasContext) {
  if (!browser) return;

  if (!file.type) {
    throw new Error('Could not determine the file type');
  }

  if (file.type === 'text/plain') {
    await processTextFile(file, ctx);
  } else if (file.type.startsWith('image/')) {
    await processImageFile(file, ctx);
  } else if (file.type === 'application/geo+json') {
    await processGeoJsonFile(file, ctx);
  } else {
    throw new Error('Unsupported file type: ' + file.type);
  }
}

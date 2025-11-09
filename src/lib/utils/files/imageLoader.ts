import type { CanvasContext } from '$lib/context/canvasContext.svelte';
import type { ImageData } from '$lib/types';
import { imageDataToCanvas } from '../canvasDrawer';

export async function loadImage(file: File): Promise<ImageData> {
  const isTiff =
    file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');

  let imageData: ImageData;
  if (isTiff) {
    imageData = await loadTiffImage(file);
  } else {
    imageData = await loadStandardImage(file);
  }

  const treatAsMask = isGrayscale(imageData);
  return imageData;
}

async function loadStandardImage(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      resolve({
        width: img.width,
        height: img.height,
        canvasElement: canvas,
      });
    };

    img.onerror = (e) => {
      console.error(e);
      return reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

async function loadTiffImage(file: File): Promise<ImageData> {
  try {
    // dynamically import tiff library
    const UTIF = (await import('$lib/packages/utif')).default;
    const buf = await file.arrayBuffer();
    const ifds = UTIF.decode(buf);
    if (ifds.length === 0) {
      throw new Error('Failed to decode TIFF');
    }

    UTIF.decodeImage(buf, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]); // Uint8Array [r,g,b,a,...]
    const width = ifds[0].width;
    const height = ifds[0].height;

    const clamped = new Uint8ClampedArray(rgba.buffer); // convert to Uint8ClampedArray
    const imageCanvas = imageDataToCanvas(clamped, width, height);
    return {
      canvasElement: imageCanvas,
      width,
      height,
    };
  } catch (error) {
    throw new Error(`Failed to load TIFF image: ${(error as Error).message}`);
  }
}

/**
 * Checks whether an image is grayscale by comparing RGB channel values.
 *
 * @param {ImageData} imageData - The image data to check
 * @param {number} [tolerance=2] - Maximum allowed difference between RGB channels
 *   for a pixel to be considered grayscale. A tolerance of 0 means R, G, and B
 *   must be exactly equal. Higher values allow for compression artifacts and
 *   minor color variations (e.g., tolerance of 2 allows R=100, G=102, B=101).
 *   Recommended: 0-1 for lossless formats (PNG), 2-3 for lossy formats (JPEG).
 * @returns {boolean} True if the image appears to be grayscale, false otherwise
 */
function isGrayscale(imageData: ImageData, tolerance: number = 2) {
  const ctx = imageData.canvasElement.getContext('2d');
  const { data } = ctx!.getImageData(0, 0, imageData.width, imageData.height);

  // check only a subset of pixels for efficiency
  const step = Math.max(1, Math.floor(data.length / (4 * 50000))); // sample max 50k pixels

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // allow small rounding differences
    if (Math.abs(r - g) > tolerance || Math.abs(g - b) > tolerance || Math.abs(r - b) > tolerance) {
      return false;
    }
  }

  return true;
}

export async function processImageFile(file: File, ctx: CanvasContext) {
  try {
    const imageData = await loadImage(file);
    ctx.setImage(imageData, file.name);
  } catch (error) {
    throw new Error(
      'Failed to load image: ' + (error instanceof Error ? error.message : String(error)),
    );
  }
}

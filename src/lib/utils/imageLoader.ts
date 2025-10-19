import type { ImageData } from '$lib/types';
import { imageDataToCanvas } from './canvasDrawer';

declare global {
  interface Window {
    UTIF: {
      decode(buffer: ArrayBuffer): any[];
      toRGBA8(ifd: any): Uint8Array;
    };
  }
}

export async function loadImage(file: File): Promise<ImageData> {
  const isTiff =
    file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');

  if (isTiff) {
    return loadTiffImage(file);
  } else {
    return loadStandardImage(file);
  }
}

async function loadStandardImage(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        img,
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
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
      img: imageCanvas,
      width,
      height,
    };
  } catch (error) {
    throw new Error(`Failed to load TIFF image: ${(error as Error).message}`);
  }
}

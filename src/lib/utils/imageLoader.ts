import type { ImageData } from '$lib/types';

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

function imageDataFromRaster8bit(
  raster: Uint8Array,
  width: number,
  height: number,
  samplesPerPixel: number,
): ImageData {
  const pixelCount = width * height;
  const out = new Uint8ClampedArray(pixelCount * 4);

  if (samplesPerPixel === 4) {
    // already RGBA — may need to copy
    for (let i = 0, j = 0; i < raster.length; i += 4, j += 4) {
      out[j] = raster[i];
      out[j + 1] = raster[i + 1];
      out[j + 2] = raster[i + 2];
      out[j + 3] = raster[i + 3];
    }
  } else if (samplesPerPixel === 3) {
    for (let p = 0, r = 0; p < pixelCount; p++, r += 3) {
      const j = p * 4;
      out[j] = raster[r];
      out[j + 1] = raster[r + 1];
      out[j + 2] = raster[r + 2];
      out[j + 3] = 255;
    }
  } else if (samplesPerPixel === 1) {
    for (let p = 0; p < pixelCount; p++) {
      const v = raster[p];
      const j = p * 4;
      out[j] = v;
      out[j + 1] = v;
      out[j + 2] = v;
      out[j + 3] = 255;
    }
  } else {
    throw new Error(`Unsupported samplesPerPixel: ${samplesPerPixel}`);
  }

  return new ImageData(out, width, height);
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
    return {
      imageData: clamped,
      width,
      height,
    };
  } catch (error) {
    throw new Error(`Failed to load TIFF image: ${(error as Error).message}`);
  }
}

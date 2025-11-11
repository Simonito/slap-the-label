import type { CanvasContext } from '$lib/context/canvasContext.svelte';
import type { ImageData } from '$lib/types';
import { imageDataToCanvas } from '../canvasDrawer';

const DEBUG_LOG = false;

export async function loadImage(file: File) {
  const isTiff =
    file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff');

  let imageData: ImageData;
  if (isTiff) {
    imageData = await loadTiffImage(file);
  } else {
    imageData = await loadStandardImage(file);
  }

  return { imageData, isGrayscale: isGrayscale(imageData) };
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

    const width = ifds[0].width;
    const height = ifds[0].height;

    const rgba = await loadAsRGBA(ifds[0]);

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

async function loadAsRGBA(ifd: ArrayBuffer | any) {
  /*
    This function is purely vibecoded using Claude
    and just going back and forth with prompts like
    "does not work, here are the logs: ... fix please".
    So we might go and reimplement this from scratch one day :/
  */
  const width = ifd.width;
  const height = ifd.height;

  // Check photometric interpretation
  const photometric = ifd.t262?.[0] ?? 2;
  const samplesPerPixel = ifd.t277?.[0] ?? 1;
  const bitsPerSample = ifd.t258?.[0] ?? 8;

  DEBUG_LOG &&
    console.log('TIFF Info:', {
      width,
      height,
      photometric,
      samplesPerPixel,
      bitsPerSample,
      dataLength: ifd.data?.length,
      expectedPixels: width * height,
      bytesPerPixel: ifd.data.length / (width * height),
    });

  let rgba: Uint8Array;

  // Calculate actual bytes per pixel from the data
  const bytesPerPixel = ifd.data.length / (width * height);

  // If it's grayscale (photometric 0 or 1) or single channel
  if (photometric === 0 || photometric === 1 || samplesPerPixel === 1) {
    // Get raw grayscale data
    let grayData: Uint8Array;

    if (bitsPerSample === 32 || bytesPerPixel === 4) {
      // 32-bit grayscale (4 bytes per pixel)

      // Try as uint32 (masks are often stored as integers)
      const data32 = new Uint32Array(ifd.data.buffer, ifd.data.byteOffset, ifd.data.byteLength / 4);

      DEBUG_LOG &&
        console.log('Uint32Array created:', { length: data32.length, expected: width * height });

      // Collect all unique non-zero values
      const uniqueValues = new Set<number>();
      let nonZeroCount = 0;

      for (let i = 0; i < data32.length; i++) {
        const val = data32[i];
        if (val !== 0) {
          uniqueValues.add(val);
          nonZeroCount++;
        }
      }

      const sortedUniqueValues = Array.from(uniqueValues).sort((a, b) => a - b);

      DEBUG_LOG &&
        console.log('Uint32 analysis:', {
          nonZeroCount,
          totalPixels: data32.length,
          uniqueNonZeroValues: sortedUniqueValues.length,
          percentageNonZero: ((nonZeroCount / data32.length) * 100).toFixed(2) + '%',
          sampleValues: sortedUniqueValues.slice(0, 20),
        });

      grayData = new Uint8Array(width * height);

      // If we have a reasonable number of unique values, treat them as distinct classes
      if (sortedUniqueValues.length <= 256) {
        console.log('Using class-based mapping (distinct colors for each class)');

        // Create a lookup map: value -> grayscale level
        const valueMap = new Map<number, number>();
        valueMap.set(0, 0); // background stays black

        // Assign each unique value a distinct grayscale level
        sortedUniqueValues.forEach((val, idx) => {
          // Spread values evenly across 1-255 range
          valueMap.set(val, Math.round(((idx + 1) * 255) / sortedUniqueValues.length));
        });

        DEBUG_LOG &&
          console.log(
            'Value mapping sample:',
            Array.from(valueMap.entries())
              .slice(0, 10)
              .map(([k, v]) => `${k}->${v}`),
          );

        for (let i = 0; i < data32.length; i++) {
          grayData[i] = valueMap.get(data32[i]) ?? 0;
        }
      } else {
        // Too many unique values - use simple binarization or normalization
        DEBUG_LOG && console.log('Using binarization (too many unique values)');

        // Simple approach: any non-zero value becomes white
        for (let i = 0; i < data32.length; i++) {
          grayData[i] = data32[i] > 0 ? 255 : 0;
        }
      }
    } else if (bitsPerSample === 16) {
      // 16-bit grayscale - convert to 8-bit
      const data16 = new Uint16Array(ifd.data.buffer, ifd.data.byteOffset, ifd.data.byteLength / 2);
      grayData = new Uint8Array(data16.length);
      for (let i = 0; i < data16.length; i++) {
        grayData[i] = data16[i] >> 8; // convert 16-bit to 8-bit
      }
    } else if (bitsPerSample === 1) {
      // 1-bit (binary) - unpack bits
      const dataBits = new Uint8Array(ifd.data);
      grayData = new Uint8Array(width * height);
      for (let i = 0; i < grayData.length; i++) {
        const byteIndex = Math.floor(i / 8);
        const bitIndex = 7 - (i % 8);
        const bit = (dataBits[byteIndex] >> bitIndex) & 1;
        grayData[i] = bit * 255; // convert to 0 or 255
      }
    } else {
      // 8-bit grayscale
      grayData = new Uint8Array(ifd.data);
    }

    // Find min/max of converted data
    let minVal = 255,
      maxVal = 0;
    let convertedNonZero = 0;
    const uniqueConverted = new Set<number>();

    for (let i = 0; i < grayData.length; i++) {
      uniqueConverted.add(grayData[i]);
      if (grayData[i] < minVal) minVal = grayData[i];
      if (grayData[i] > maxVal) maxVal = grayData[i];
      if (grayData[i] > 0) convertedNonZero++;
    }

    DEBUG_LOG &&
      console.log('Final grayscale data:', {
        grayDataLength: grayData.length,
        min: minVal,
        max: maxVal,
        nonZeroPixels: convertedNonZero,
        uniqueGrayscaleLevels: uniqueConverted.size,
        distributionSample: Array.from(uniqueConverted)
          .sort((a, b) => a - b)
          .slice(0, 20),
      });

    // Convert grayscale to RGBA
    rgba = new Uint8Array(width * height * 4);
    for (let i = 0, j = 0; i < grayData.length; i++, j += 4) {
      const gray = grayData[i];
      rgba[j] = gray; // R
      rgba[j + 1] = gray; // G
      rgba[j + 2] = gray; // B
      rgba[j + 3] = 255; // A
    }
  } else {
    // dynamically import tiff library
    const UTIF = (await import('$lib/packages/utif')).default;
    // Use standard RGBA conversion for color images
    rgba = UTIF.toRGBA8(ifd);
  }

  return rgba;
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
function isGrayscale(imageData: ImageData, tolerance: number = 2): boolean {
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

function treatAsMask(candidate: ImageData, current: ImageData | null) {
  if (!current) {
    return false;
  }

  if (current.height !== candidate.height || current.width !== candidate.width) {
    // mask should have the same dimensions as the image to be overlaid onto
    return false;
  }

  return true;
}

export async function processImageFile(file: File, ctx: CanvasContext) {
  try {
    const { imageData, isGrayscale } = await loadImage(file);
    if (isGrayscale && treatAsMask(imageData, ctx.imageData)) {
      ctx.setMask(imageData);
    } else {
      ctx.setImage(imageData, file.name);
    }
  } catch (error) {
    throw new Error(
      'Failed to load image: ' + (error instanceof Error ? error.message : String(error)),
    );
  }
}

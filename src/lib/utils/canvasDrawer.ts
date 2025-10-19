export function imageDataToCanvas(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  // if data is RGB (3 channels per pixel), convert it to RGBA
  if (data.length === width * height * 3) {
    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      rgba[j] = data[i];
      rgba[j + 1] = data[i + 1];
      rgba[j + 2] = data[i + 2];
      rgba[j + 3] = 255; // full opacity
    }
    data = rgba;
  }

  const imageDataObj = new ImageData(new Uint8ClampedArray(data), width, height);
  ctx.putImageData(imageDataObj, 0, 0);

  return canvas;
}

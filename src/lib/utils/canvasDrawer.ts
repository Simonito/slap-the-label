import type { Annotation, ImageData, DrawSettings } from "$lib/types";

export function drawCanvas(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  annotations: Annotation[],
  classColors: Map<string, string>,
  settings: DrawSettings,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { zoom, lineWidth, showLabels } = settings;

  // Set canvas size based on image and zoom
  canvas.width = imageData.width * zoom;
  canvas.height = imageData.height * zoom;

  // Draw image
  if (imageData.img) {
    ctx.drawImage(imageData.img, 0, 0, canvas.width, canvas.height);
  } else if (imageData.imageData) {
    // For TIFF images, draw from raw pixel data
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      const imgData = tempCtx.createImageData(
        imageData.width,
        imageData.height,
      );
      imgData.data.set(imageData.imageData);
      tempCtx.putImageData(imgData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }
  }

  // Draw annotations
  ctx.lineWidth = lineWidth;
  ctx.font = `${14 * zoom}px sans-serif`;

  for (const annotation of annotations) {
    const color = classColors.get(annotation.class) || "#00ff00";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // Convert normalized coordinates to canvas coordinates
    const x = (annotation.x - annotation.w / 2) * canvas.width;
    const y = (annotation.y - annotation.h / 2) * canvas.height;
    const w = annotation.w * canvas.width;
    const h = annotation.h * canvas.height;

    // Draw bounding box
    ctx.strokeRect(x, y, w, h);

    // Draw label if enabled
    if (showLabels) {
      const label = `Class ${annotation.class}`;
      const metrics = ctx.measureText(label);
      const padding = 4 * zoom;

      // Draw label background
      ctx.fillRect(
        x,
        y - 14 * zoom - padding * 2,
        metrics.width + padding * 2,
        14 * zoom + padding * 2,
      );

      // Draw label text
      ctx.fillStyle = "#000";
      ctx.fillText(label, x + padding, y - padding);
      ctx.fillStyle = color;
    }
  }
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

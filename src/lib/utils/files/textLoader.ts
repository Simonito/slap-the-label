import type { CanvasContext } from '$lib/context/canvasContext.svelte';
import { generateClassColors, parseYoloFile } from '../yoloParser';

export async function isYoloAnnotation(file: File) {
  // Totally vibe coded:

  // arbitrary file size (we just want to peek into file)
  const chunk = await file.slice(0, 2048).text();
  const lines = chunk.split(/\r?\n/).filter(Boolean).slice(0, 10);

  if (lines.length === 0) return false;

  if (lines.length !== 1) {
    // we only read certain amount of bytes which is hopefully more than just 1 line
    // (at least for YOLO style annotations)
    // but that means that we can cut some information from the line,
    // which means our regex would fail on that line, even though in the original file
    // it might be good
    // Solution: just pop that line
    //           - we just want to peek the first few lines anyway, soooo ...
    lines.pop();
  }

  const yoloRegex = /^\d+(?:\s+\d*\.?\d+){4,}$/;

  let matchCount = 0;

  for (const line of lines) {
    const match = yoloRegex.test(line.trim());
    if (!match) continue;

    // Extra heuristic: check normalized coordinates
    const parts = line.trim().split(/\s+/).map(Number);
    if (parts.length < 5) continue;

    const [, ...coords] = parts;
    const normalized = coords.every((n) => n >= 0 && n <= 1);

    if (normalized) matchCount++;
  }
  return matchCount === lines.length;
}

export async function processTextFile(file: File, ctx: CanvasContext) {
  if (await isYoloAnnotation(file)) {
    if (!ctx.imageData) {
      throw new Error('Add an image first to view the labels');
    }

    const text = await file.text();
    const annotations = parseYoloFile(text);
    const colors = generateClassColors(annotations);

    console.log(Array.from(colors.values())[0]);
    ctx.addAnnotationFile({
      annotations,
      color: Array.from(colors.values())[0],
      name: file.name,
      visible: true,
    });
  } else {
    throw new Error('Text file is not recognized as YOLO annotations');
  }
}

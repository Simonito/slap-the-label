import type { Annotation } from '$lib/types';

export function parseYoloFile(content: string): Annotation[] {
  const lines = content.split('\n');
  const annotations: Annotation[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length < 5) {
      continue;
    }

    const [classId, x, y, w, h] = parts.map(Number);

    // Validate values are in range [0, 1]
    if ([x, y, w, h].some((v) => v < 0 || v > 1)) {
      console.warn(`Invalid annotation values: ${line}`);
      continue;
    }

    annotations.push({
      class: classId.toString(),
      x,
      y,
      w,
      h,
    });
  }

  return annotations;
}

export function generateClassColors(annotations: Annotation[]): Map<string, string> {
  const uniqueClasses = new Set(annotations.map((a) => a.class));
  const colors = new Map<string, string>();

  const hueStep = 360 / Math.max(uniqueClasses.size, 1);

  Array.from(uniqueClasses).forEach((className, index) => {
    const hue = (index * hueStep) % 360;
    colors.set(className, `hsl(${hue}, 70%, 60%)`);
  });

  return colors;
}

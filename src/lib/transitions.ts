import { cubicOut } from 'svelte/easing';
import type { FlyParams, ScaleParams } from 'svelte/transition';

type FlyFadeParams = FlyParams & { x?: number; y?: number };
type ScaleFadeParams = ScaleParams;

export function flyfade(node: Element, params: FlyFadeParams = {}) {
  const style = getComputedStyle(node);
  const existingTransform = style.transform === 'none' ? '' : style.transform;

  const { delay = 0, duration = 300, easing = cubicOut, x = 0, y = 0, opacity = 0 } = params;

  const target_opacity = +style.opacity;
  const od = target_opacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (t: number, u: number) => {
      // t goes 0 → 1 during intro
      const current_opacity = target_opacity - od * u;
      const transform = `${existingTransform} translate(${u * x}px, ${u * y}px)`;

      return `
        transform: ${transform};
        opacity: ${current_opacity};
      `;
    },
  };
}

export function scalefade(node: Element, params: ScaleFadeParams = {}) {
  const style = getComputedStyle(node);
  const existingTransform = style.transform === 'none' ? '' : style.transform;

  const { delay = 0, duration = 300, easing = cubicOut, opacity = 0, start = 0.8 } = params;

  const target_opacity = +style.opacity;
  const od = target_opacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (t: number, u: number) => {
      // t goes 0 → 1 during intro
      const current_opacity = target_opacity - od * u;
      const scale = start + (1 - start) * t;

      return `
        transform: ${existingTransform} scale(${scale});
        opacity: ${current_opacity};
      `;
    },
  };
}

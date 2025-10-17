import { cubicOut } from 'svelte/easing';
import type { FlyParams } from 'svelte/transition';

type FlyFadeParams = FlyParams & { x?: number; y?: number };

export function slidefade(node: Element, params: FlyParams = {}) {
  const existingTransform = getComputedStyle(node).transform.replace('none', '');

  return {
    delay: params?.delay || 0,
    duration: params?.duration || 300,
    easing: params?.easing || cubicOut,
    css: (t: number, u: number) =>
      `transform-origin: top left; transform: ${existingTransform} scaleY(${t}); opacity: ${t};`,
  };
}

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

export interface Annotation {
  class: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ImageData {
  width: number;
  height: number;
  img?: HTMLImageElement;
  imageData?: Uint8ClampedArray;
}

export interface DrawSettings {
  zoom: number;
  lineWidth: number;
  showLabels: boolean;
}

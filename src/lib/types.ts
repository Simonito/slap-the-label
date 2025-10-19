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
  img: HTMLCanvasElement | HTMLImageElement;
}

export interface DrawSettings {
  zoom: number;
  lineWidth: number;
  showLabels: boolean;
}

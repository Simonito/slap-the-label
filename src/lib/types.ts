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
  canvasElement: HTMLCanvasElement;
}

export interface DrawSettings {
  zoom: number;
  lineWidth: number;
  showLabels: boolean;
}

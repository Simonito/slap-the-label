export interface BBoxAnnotation {
  type: 'bbox';
  class: string;
  x: number;
  y: number;
  w: number;
  h: number;
  sourceFile?: string; // track which file this came from
}

export interface PolygonAnnotation {
  type: 'polygon';
  class?: string;
  points: number[]; // flat array [x1, y1, x2, y2, ...]
  properties?: Record<string, any>; // store any GeoJSON properties
  sourceFile?: string;
}

export type Annotation = BBoxAnnotation | PolygonAnnotation;

export interface AnnotationFile {
  name: string;
  annotations: Annotation[];
  visible: boolean;
  color: string; // distinct color per file
}

export interface ImageData {
  width: number;
  height: number;
  canvasElement: HTMLCanvasElement;
}

export interface DrawSettings {
  lineWidth: number;
  showLabels: boolean;
}

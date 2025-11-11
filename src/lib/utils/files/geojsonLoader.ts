import type { CanvasContext } from '$lib/context/canvasContext.svelte';
import type { PolygonAnnotation } from '$lib/types';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties?: Record<string, any>;
}

interface GeoJSON {
  type: 'FeatureCollection' | 'Feature';
  features?: GeoJSONFeature[];
  geometry?: GeoJSONFeature['geometry'];
  properties?: Record<string, any>;
}

export async function processGeoJsonFile(file: File, ctx: CanvasContext) {
  if (!ctx.imageData) {
    throw new Error('Add an image first to view the labels');
  }
  const color = `hsl(${Math.random() * 360}, 70%, 50%)`;

  const geojsonText = await file.text();
  const annotations = parseGeoJSON(
    geojsonText,
    file.name,
    ctx.imageData.width,
    ctx.imageData.height,
  );
  ctx.addAnnotationFile({
    name: file.name,
    annotations,
    visible: true,
    color,
  });
}

function parseGeoJSON(
  geojsonText: string,
  sourceFile: string,
  imageWidth: number,
  imageHeight: number,
): PolygonAnnotation[] {
  const geojson: GeoJSON = JSON.parse(geojsonText);
  const annotations: PolygonAnnotation[] = [];

  const features: GeoJSONFeature[] =
    geojson.type === 'FeatureCollection'
      ? geojson.features || []
      : geojson.type === 'Feature'
        ? [geojson as GeoJSONFeature]
        : [];

  console.log({ feat: features[0] });

  for (const feature of features) {
    if (!feature.geometry) continue;

    const { type, coordinates } = feature.geometry;
    const className =
      (feature.properties?.class as string) ||
      (feature.properties?.name as string) ||
      (feature.properties?.label as string) ||
      undefined;

    if (type === 'Polygon') {
      // coordinates is number[][][]
      const polygonCoords = coordinates as number[][][];
      const ring = polygonCoords[0]; // exterior ring: [[x1,y1], [x2,y2], ...]
      const points = normalizeCoordinates(ring, imageWidth, imageHeight);

      annotations.push({
        type: 'polygon',
        class: className,
        points,
        properties: feature.properties,
        sourceFile,
      });
    } else if (type === 'MultiPolygon') {
      // MultiPolygon: [[[[x1,y1], [x2,y2], ...]], ...]
      // coordinates is number[][][][]
      const multiPolygonCoords = coordinates as number[][][][];
      for (const polygon of multiPolygonCoords) {
        const ring = polygon[0]; // exterior ring: [[x1,y1], [x2,y2], ...]
        const points = normalizeCoordinates(ring, imageWidth, imageHeight);

        annotations.push({
          type: 'polygon',
          class: className,
          points,
          properties: feature.properties,
          sourceFile,
        });
      }
    }
  }

  return annotations;
}

function normalizeCoordinates(ring: number[][], imageWidth: number, imageHeight: number): number[] {
  const points: number[] = [];

  if (ring.length === 0) return points;

  // Calculate bounding box of the polygon
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (const coord of ring) {
    if (coord.length < 2) continue;
    const x = coord[0];
    const y = coord[1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const width = maxX - minX;
  const height = maxY - minY;

  // Determine coordinate system
  const isNormalized = maxX <= 1 && maxY <= 1 && minX >= 0 && minY >= 0;
  const isPixelSpace = width > 10 && height > 10; // Likely pixel coordinates

  console.log('Polygon bounds:', {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    isNormalized,
    isPixelSpace,
  });

  for (const coord of ring) {
    if (coord.length < 2) continue;

    const x = coord[0];
    const y = coord[1];

    if (isNormalized) {
      // Already normalized (0-1)
      points.push(x, y);
    } else if (isPixelSpace) {
      // Pixel coordinates - normalize to 0-1
      points.push(x / imageWidth, y / imageHeight);
    } else {
      // Unknown coordinate system - try to fit to image bounds
      points.push((x - minX) / width, (y - minY) / height);
    }
  }

  return points;
}

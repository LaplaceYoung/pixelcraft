import { PatternData, BeadColor, PixelPoint } from '../types';
import { findClosestColor } from './colorUtils';

export const processImage = (
  image: HTMLImageElement,
  targetWidth: number,
  activePalette: BeadColor[]
): PatternData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Calculate aspect ratio
  const aspectRatio = image.height / image.width;
  const targetHeight = Math.round(targetWidth * aspectRatio);

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Draw image resized
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imageData.data;

  const grid: PixelPoint[][] = [];

  for (let y = 0; y < targetHeight; y++) {
    const row: PixelPoint[] = [];
    for (let x = 0; x < targetWidth; x++) {
      const i = (y * targetWidth + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // const a = data[i + 3]; // Ignore alpha for now, assume opaque

      const closest = findClosestColor(r, g, b, activePalette);
      
      row.push({
        x,
        y,
        colorId: closest ? closest.id : 'unknown',
        originalColor: `rgb(${r},${g},${b})`
      });
    }
    grid.push(row);
  }

  return {
    width: targetWidth,
    height: targetHeight,
    grid
  };
};

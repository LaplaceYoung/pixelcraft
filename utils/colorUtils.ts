import { BeadColor } from '../types';

// Helper to convert Hex to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

// RGB to XYZ
const rgbToXyz = (r: number, g: number, b: number) => {
  let rLin = r / 255;
  let gLin = g / 255;
  let bLin = b / 255;

  rLin = rLin > 0.04045 ? Math.pow((rLin + 0.055) / 1.055, 2.4) : rLin / 12.92;
  gLin = gLin > 0.04045 ? Math.pow((gLin + 0.055) / 1.055, 2.4) : gLin / 12.92;
  bLin = bLin > 0.04045 ? Math.pow((bLin + 0.055) / 1.055, 2.4) : bLin / 12.92;

  rLin *= 100;
  gLin *= 100;
  bLin *= 100;

  const x = rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805;
  const y = rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722;
  const z = rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505;

  return { x, y, z };
};

// XYZ to Lab
const xyzToLab = (x: number, y: number, z: number) => {
  // Observer= 2°, Illuminant= D65
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  let varX = x / refX;
  let varY = y / refY;
  let varZ = z / refZ;

  varX = varX > 0.008856 ? Math.pow(varX, 1 / 3) : (7.787 * varX) + (16 / 116);
  varY = varY > 0.008856 ? Math.pow(varY, 1 / 3) : (7.787 * varY) + (16 / 116);
  varZ = varZ > 0.008856 ? Math.pow(varZ, 1 / 3) : (7.787 * varZ) + (16 / 116);

  const l = (116 * varY) - 16;
  const a = 500 * (varX - varY);
  const b = 200 * (varY - varZ);

  return { l, a, b };
};

export const hexToLab = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const { x, y, z } = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
};

// Calculate Delta E 76 (Euclidean distance in Lab)
// Note: Delta E 2000 is more accurate but computationally heavy for real-time 2500+ pixels in JS. 
// DE76 fits the "retro" vibe better anyway (less perceptually perfect, more raw).
const deltaE = (lab1: { l: number; a: number; b: number }, lab2: { l: number; a: number; b: number }) => {
  return Math.sqrt(
    Math.pow(lab1.l - lab2.l, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
};

export const findClosestColor = (
  r: number, 
  g: number, 
  b: number, 
  palette: BeadColor[]
): BeadColor | null => {
  if (palette.length === 0) return null;

  const { x, y, z } = rgbToXyz(r, g, b);
  const targetLab = xyzToLab(x, y, z);

  let minDelta = Infinity;
  let closest: BeadColor = palette[0];

  for (const color of palette) {
    // If LAB isn't pre-calculated, calculate it (and maybe mutate object for cache if we could, but here we just compute)
    let lab = { l: color.l || 0, a: color.a || 0, b: color.b || 0 };
    
    // Fallback if pre-calc missing (it is in our store init, but safety first)
    if (!color.l) {
      const cLab = hexToLab(color.hex);
      lab = cLab;
    }

    const dE = deltaE(targetLab, lab);
    if (dE < minDelta) {
      minDelta = dE;
      closest = color;
    }
  }

  return closest;
};

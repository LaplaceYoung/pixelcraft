export interface BeadColor {
  id: string;
  brand: 'Perler' | 'Artkal' | 'Hama';
  name: string;
  hex: string;
  l?: number; // Lab values cached for performance
  a?: number;
  b?: number;
}

export interface PixelPoint {
  x: number;
  y: number;
  colorId: string;
  originalColor: string; // hex
}

export interface PatternData {
  width: number;
  height: number;
  grid: PixelPoint[][];
}

export type Language = 'en' | 'zh';

export interface AppState {
  language: Language;
  targetWidth: number;
  selectedBrand: string; // 'All' or specific brand
  ownedColorsOnly: boolean;
  showGrid: boolean;
  showNumbers: boolean;
  
  // Data
  originalImage: HTMLImageElement | null;
  pattern: PatternData | null;
  palette: BeadColor[];
  disabledColorIds: string[]; // Colors user has unchecked (don't own)

  // Actions
  setLanguage: (lang: Language) => void;
  setTargetWidth: (width: number) => void;
  setOriginalImage: (img: HTMLImageElement) => void;
  toggleColorOwnership: (id: string) => void;
  generatePattern: () => void;
  setShowGrid: (show: boolean) => void;
  setShowNumbers: (show: boolean) => void;
}

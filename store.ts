import { create } from 'zustand';
import { AppState, BeadColor } from './types';
import { PERLER_COLORS } from './constants';
import { hexToLab } from './utils/colorUtils';
import { processImage } from './utils/imageUtils';

// Pre-calculate LAB for performance
const INITIAL_PALETTE = PERLER_COLORS.map(c => {
  const lab = hexToLab(c.hex);
  return { ...c, ...lab };
});

export const useAppStore = create<AppState>((set, get) => ({
  language: 'zh',
  targetWidth: 40,
  selectedBrand: 'All',
  ownedColorsOnly: false,
  showGrid: true,
  showNumbers: false,
  
  originalImage: null,
  pattern: null,
  palette: INITIAL_PALETTE,
  disabledColorIds: [],

  setLanguage: (lang) => set({ language: lang }),
  
  setTargetWidth: (width) => {
    set({ targetWidth: width });
    get().generatePattern();
  },
  
  setOriginalImage: (img) => {
    set({ originalImage: img });
    get().generatePattern();
  },
  
  toggleColorOwnership: (id) => {
    const { disabledColorIds } = get();
    const isIdsabled = disabledColorIds.includes(id);
    const newDisabled = isIdsabled
      ? disabledColorIds.filter(d => d !== id)
      : [...disabledColorIds, id];
    
    set({ disabledColorIds: newDisabled });
    // Regenerate because palette availability changed
    get().generatePattern();
  },

  setShowGrid: (show) => set({ showGrid: show }),
  setShowNumbers: (show) => set({ showNumbers: show }),

  generatePattern: () => {
    const { originalImage, targetWidth, palette, disabledColorIds } = get();
    if (!originalImage) return;

    // Filter palette based on disabled IDs
    const activePalette = palette.filter(c => !disabledColorIds.includes(c.id));

    // Fallback: if user disables ALL colors, use B&W or just don't crash. 
    // We'll ensure at least one color exists or handle empty array in util.
    if (activePalette.length === 0) {
       // Ideally show toast/error. For now, do nothing or use full palette.
       return; 
    }

    const pattern = processImage(originalImage, targetWidth, activePalette);
    set({ pattern });
  }
}));
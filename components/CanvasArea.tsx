import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Card } from './ui/Card';
import { TRANSLATIONS } from '../constants';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export const CanvasArea: React.FC = () => {
  const { 
    pattern, 
    palette, 
    showGrid, 
    showNumbers, 
    language,
    originalImage
  } = useAppStore();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (!pattern || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define pixel size based on visual requirement, not actual bead size.
    // 20px per bead is good for visibility.
    const PIXEL_SIZE = 20;
    
    // Set canvas dimensions
    canvas.width = pattern.width * PIXEL_SIZE;
    canvas.height = pattern.height * PIXEL_SIZE;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw
    pattern.grid.forEach((row, y) => {
      row.forEach((pixel, x) => {
        const color = palette.find(c => c.id === pixel.colorId);
        if (color) {
          ctx.fillStyle = color.hex;
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

          // Grid
          if (showGrid) {
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
          }

          // Bead effect (subtle circle/shadow)
          // To make it look more like beads, we can draw a lighter circle inside
          if (!showNumbers) {
             ctx.fillStyle = 'rgba(255,255,255,0.2)';
             ctx.beginPath();
             ctx.arc(x * PIXEL_SIZE + PIXEL_SIZE/2, y * PIXEL_SIZE + PIXEL_SIZE/2, PIXEL_SIZE/4, 0, Math.PI * 2);
             ctx.fill();
             
             // Hole
             ctx.fillStyle = 'rgba(0,0,0,0.15)';
             ctx.beginPath();
             ctx.arc(x * PIXEL_SIZE + PIXEL_SIZE/2, y * PIXEL_SIZE + PIXEL_SIZE/2, PIXEL_SIZE/8, 0, Math.PI * 2);
             ctx.fill();
          }

          // ID Numbers
          if (showNumbers) {
            ctx.fillStyle = getContrastYIQ(color.hex);
            ctx.font = '8px "Space Mono"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Only draw part of ID to save space, e.g. P05 -> 05
            const shortId = color.id.replace(/[A-Z]/g, ''); 
            ctx.fillText(shortId, x * PIXEL_SIZE + PIXEL_SIZE/2, y * PIXEL_SIZE + PIXEL_SIZE/2);
          }
        }
      });
    });

  }, [pattern, palette, showGrid, showNumbers]);

  // Helper for text contrast
  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.2, Math.min(3, prev + delta)));
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-[400px]">
      <div className="bg-white border-2 border-black shadow-hard flex-1 relative overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button 
            onClick={() => handleZoom(-0.1)}
            className="bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-hard-sm"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={() => setZoom(1)}
            className="bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-hard-sm font-mono text-xs flex items-center"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button 
            onClick={() => handleZoom(0.1)}
            className="bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-hard-sm"
          >
            <ZoomIn size={20} />
          </button>
        </div>

        {/* Workspace */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-8 bg-[#e5e5e5] flex items-center justify-center"
          style={{
             backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)',
             backgroundSize: '10px 10px'
          }}
        >
          {originalImage ? (
            <div 
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out'
              }}
              className="bg-white shadow-xl"
            >
              <canvas ref={canvasRef} className="block pixelated" />
            </div>
          ) : (
             <div className="text-center text-gray-400 font-mono">
                <Maximize size={48} className="mx-auto mb-4 opacity-20" />
                <p>{t.emptyState}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

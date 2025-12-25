import React, { useMemo, useState } from 'react';
import { CheckSquare, Square, Download, Settings2 } from 'lucide-react';
import { useAppStore } from '../store';
import { TRANSLATIONS } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PaletteModal } from './PaletteModal';

export const RightPanel: React.FC = () => {
  const {
    language,
    palette,
    disabledColorIds,
    toggleColorOwnership,
    pattern
  } = useAppStore();

  const t = TRANSLATIONS[language];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    if (!pattern) return [];

    const counts: Record<string, number> = {};
    pattern.grid.forEach(row => {
      row.forEach(pixel => {
        counts[pixel.colorId] = (counts[pixel.colorId] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([id, count]) => {
        const color = palette.find(c => c.id === id);
        return { color, count };
      })
      .filter(item => item.color) // Safety check
      .sort((a, b) => b.count - a.count); // Sort by usage
  }, [pattern, palette]);

  const totalBeads = useMemo(() => {
    return stats.reduce((acc, curr) => acc + curr.count, 0);
  }, [stats]);

  const handleDownload = () => {
    const canvas = document.getElementById('pixel-export-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "pixelcraft-pattern.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4 h-full overflow-hidden">

      <PaletteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Stats Panel */}
      <Card title={t.stats} className="flex-1 min-h-[300px] flex flex-col overflow-hidden">
        <div className="mb-4 flex justify-between items-baseline border-b-2 border-gray-100 pb-2">
          <span className="text-xs text-gray-500 font-mono">{t.totalBeads}</span>
          <span className="font-bold text-xl font-pixel">{totalBeads}</span>
        </div>

        <div className="overflow-y-auto pr-2 flex-1 space-y-2 custom-scrollbar p-1">
          {stats.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4 italic">{t.emptyState}</div>
          ) : (
            stats.map(({ color, count }) => (
              <div
                key={color!.id}
                className="flex items-center gap-3 text-sm p-2 border border-transparent hover:bg-white hover:border-black hover:shadow-hard-sm transition-all duration-150"
              >
                <div
                  className="w-4 h-4 border border-black shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                  style={{ backgroundColor: color!.hex }}
                />
                <div className="flex-1 font-mono text-xs">
                  <span className="font-bold text-gray-900">{color!.id}</span>
                  <span className="ml-1 text-gray-500 truncate">{color!.name}</span>
                </div>
                <span className="font-bold font-mono">{count}</span>
              </div>
            ))
          )}
        </div>

        <Button
          onClick={handleDownload}
          disabled={!pattern}
          className="mt-4 w-full flex items-center justify-center gap-2"
        >
          <Download size={16} />
          {t.download}
        </Button>
      </Card>

      {/* Palette Manager */}
      <Card className="max-h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <h3 className="font-pixel text-xs md:text-sm uppercase tracking-wide">{t.palette}</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-black hover:text-white transition-colors rounded-sm"
            title={t.managePalette}
          >
            <Settings2 size={16} />
          </button>
        </div>

        <div className="overflow-y-auto pr-2 space-y-1 custom-scrollbar p-1">
          {palette.map((color) => {
            const isOwned = !disabledColorIds.includes(color.id);
            return (
              <div
                key={color.id}
                onClick={() => toggleColorOwnership(color.id)}
                className={`
                  flex items-center gap-2 p-1.5 cursor-pointer 
                  border border-transparent 
                  transition-all duration-150
                  hover:bg-white hover:border-black hover:shadow-hard-sm hover:-translate-y-0.5
                  ${!isOwned ? 'opacity-50 hover:opacity-100' : ''}
                `}
              >
                {isOwned ? (
                  <CheckSquare size={16} className="text-retro-teal" />
                ) : (
                  <Square size={16} className="text-gray-300" />
                )}

                <div
                  className="w-4 h-4 border border-black rounded-sm"
                  style={{ backgroundColor: color.hex }}
                />

                <span className={`text-xs font-mono flex-1 ${!isOwned && 'line-through decoration-black'}`}>
                  {color.name}
                </span>

                <span className="text-[10px] text-gray-400 font-mono">{color.id}</span>
              </div>
            );
          })}
        </div>
      </Card>

    </aside>
  );
};
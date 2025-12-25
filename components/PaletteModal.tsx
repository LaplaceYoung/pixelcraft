import React, { useState } from 'react';
import { useAppStore } from '../store';
import { TRANSLATIONS } from '../constants';
import { Search, CheckSquare, Square, Filter } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface PaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaletteModal: React.FC<PaletteModalProps> = ({ isOpen, onClose }) => {
  const { palette, disabledColorIds, toggleColorOwnership, language } = useAppStore();
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');

  const filteredPalette = palette.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.managePalette}>
      <div className="flex flex-col gap-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50 p-4 border-2 border-black shadow-hard-sm">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder={t.searchColor}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black font-mono focus:outline-none focus:bg-white bg-transparent transition-colors placeholder-gray-500"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             {/* Future: Add Select All/None logic */}
             <div className="text-xs font-mono text-gray-500 self-center">
                {filteredPalette.length} Colors
             </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredPalette.map((color) => {
            const isOwned = !disabledColorIds.includes(color.id);
            return (
              <button
                key={color.id}
                onClick={() => toggleColorOwnership(color.id)}
                className={`
                  group relative flex flex-col gap-2 p-3 border-2 transition-all duration-200
                  text-left
                  ${isOwned 
                    ? 'bg-white border-black shadow-hard hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0_0_#000]' 
                    : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div
                    className={`w-8 h-8 border-2 ${isOwned ? 'border-black' : 'border-gray-300'} shadow-sm`}
                    style={{ backgroundColor: color.hex }}
                  />
                  {isOwned ? (
                    <CheckSquare size={20} className="text-retro-teal" />
                  ) : (
                    <Square size={20} className="text-gray-300" />
                  )}
                </div>
                <div>
                  <div className={`font-bold font-mono text-sm ${isOwned ? 'text-black' : 'text-gray-400'}`}>
                    {color.id}
                  </div>
                  <div className="text-xs truncate font-mono mt-1 opacity-80">{color.name}</div>
                </div>
              </button>
            );
          })}
        </div>
        
        {filteredPalette.length === 0 && (
           <div className="text-center py-10 font-mono text-gray-500 border-2 border-dashed border-gray-300">
             No colors found matching "{search}".
           </div>
        )}
      </div>
    </Modal>
  );
};
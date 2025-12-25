import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border-4 border-black shadow-hard w-full max-w-4xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-retro-gray">
          <h2 className="font-pixel text-lg md:text-xl uppercase tracking-wider">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-black hover:text-white transition-all border-2 border-transparent hover:border-black active:scale-95"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};
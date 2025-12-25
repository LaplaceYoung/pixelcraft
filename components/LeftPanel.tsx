import React from 'react';
import { Upload, Sliders, Languages } from 'lucide-react';
import { useAppStore } from '../store';
import { TRANSLATIONS } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UploadArea } from './UploadArea';

export const LeftPanel: React.FC = () => {
  const {
    language, setLanguage,
    setOriginalImage,
    targetWidth, setTargetWidth,
    showGrid, setShowGrid,
    showNumbers, setShowNumbers
  } = useAppStore();

  const t = TRANSLATIONS[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setOriginalImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <aside className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4">
      {/* Header/Brand */}
      <Card className="bg-retro-dark text-white border-black relative overflow-visible">
        <div className="flex justify-between items-center">
          <h1 className="font-pixel text-xl tracking-tight text-white select-none">
            PixelCraft
          </h1>
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="
              px-3 py-1.5 
              bg-white text-black border-2 border-black 
              shadow-[2px_2px_0_0_#fff] 
              hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none 
              active:bg-gray-200
              flex items-center gap-2 transition-all duration-150
            "
            title={language === 'en' ? "Switch to Chinese" : "切换到英文"}
          >
            <Languages size={16} />
            <span className="text-xs font-mono font-bold">
              {language === 'en' ? 'CN' : 'EN'}
            </span>
          </button>
        </div>
      </Card>

      {/* Upload Control */}
      <Card title={t.upload}>
        <UploadArea onUpload={setOriginalImage} t={t} />
      </Card>

      {/* Settings */}
      <Card title={t.settings}>
        <div className="flex flex-col gap-6">

          {/* Width Slider */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-mono uppercase flex justify-between select-none">
              {t.width}
              <span className="bg-black text-white px-1 shadow-hard-sm">{targetWidth}</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={targetWidth}
              onChange={(e) => setTargetWidth(parseInt(e.target.value))}
              className="
                w-full h-3 bg-gray-200 rounded-none appearance-none cursor-pointer 
                border-2 border-transparent focus:border-black
                accent-retro-red
              "
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
              <span className="text-sm font-mono select-none">{t.grid}</span>
              <div
                className={`w-10 h-6 flex items-center border-2 border-black p-0.5 transition-colors ${showGrid ? 'bg-retro-teal' : 'bg-gray-300'}`}
                onClick={(e) => { e.preventDefault(); setShowGrid(!showGrid); }}
              >
                <div className={`w-4 h-4 bg-white border-2 border-black transform transition-transform ${showGrid ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
              <span className="text-sm font-mono select-none">{t.numbers}</span>
              <div
                className={`w-10 h-6 flex items-center border-2 border-black p-0.5 transition-colors ${showNumbers ? 'bg-retro-teal' : 'bg-gray-300'}`}
                onClick={(e) => { e.preventDefault(); setShowNumbers(!showNumbers); }}
              >
                <div className={`w-4 h-4 bg-white border-2 border-black transform transition-transform ${showNumbers ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>

        </div>
      </Card>

      {/* Info text */}
      <div className="text-[10px] text-gray-500 font-mono p-2 leading-tight opacity-50 hover:opacity-100 transition-opacity">
        <p>V 1.0.1</p>
        <p>Designed with ❤️ for Pixel Artists.</p>
      </div>
    </aside>
  );
};
import React from 'react';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { CanvasArea } from './components/CanvasArea';

function App() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 max-w-[1920px] mx-auto h-screen">
      <LeftPanel />
      <main className="flex-1 min-w-0">
        <CanvasArea />
      </main>
      <div className="hidden md:block">
        <RightPanel />
      </div>
      {/* Mobile Right Panel fallback (stacked or handled via tabs in a real app, keeping it simple for now) */}
      <div className="md:hidden block">
         <RightPanel />
      </div>
    </div>
  );
}

export default App;

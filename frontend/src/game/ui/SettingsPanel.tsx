import React, { useState, useEffect } from 'react';
import { X, Volume2, Monitor, Keyboard, Check } from 'lucide-react';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'AUDIO' | 'GRAPHICS' | 'CONTROLS'>('AUDIO');
  const [saved, setSaved] = useState(false);

  // Audio States
  const [masterVol, setMasterVol] = useState(80);
  const [musicVol, setMusicVol] = useState(60);
  const [sfxVol, setSfxVol] = useState(80);

  // Graphics States
  const [quality, setQuality] = useState('High');
  const [shadows, setShadows] = useState(true);
  const [viewDistance, setViewDistance] = useState('Medium');
  
  // Control States
  const [sensitivity, setSensitivity] = useState(50);
  const [invertY, setInvertY] = useState(false);
  const [sprintToggle, setSprintToggle] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gw_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.masterVol !== undefined) setMasterVol(parsed.masterVol);
        if (parsed.quality) setQuality(parsed.quality);
        if (parsed.sensitivity !== undefined) setSensitivity(parsed.sensitivity);
      }
    } catch(e) {}
  }, []);

  const handleSave = () => {
    const settings = { masterVol, musicVol, sfxVol, quality, shadows, viewDistance, sensitivity, invertY, sprintToggle };
    localStorage.setItem('gw_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-[600px] h-[500px] bg-game-dark border border-cyan-500/30 rounded-lg shadow-2xl flex flex-col font-mono text-cyan-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-cyan-500/20 bg-cyan-950/30">
          <h2 className="text-xl tracking-widest text-cyan-300 font-bold">SYSTEM SETTINGS</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cyan-900/50">
          <button onClick={() => setActiveTab('AUDIO')} className={`flex-1 py-3 flex items-center justify-center gap-2 ${activeTab === 'AUDIO' ? 'bg-cyan-900/40 text-cyan-300 border-b-2 border-cyan-400' : 'hover:bg-cyan-900/20 text-gray-400'}`}>
            <Volume2 className="w-4 h-4" /> AUDIO
          </button>
          <button onClick={() => setActiveTab('GRAPHICS')} className={`flex-1 py-3 flex items-center justify-center gap-2 ${activeTab === 'GRAPHICS' ? 'bg-cyan-900/40 text-cyan-300 border-b-2 border-cyan-400' : 'hover:bg-cyan-900/20 text-gray-400'}`}>
            <Monitor className="w-4 h-4" /> GRAPHICS
          </button>
          <button onClick={() => setActiveTab('CONTROLS')} className={`flex-1 py-3 flex items-center justify-center gap-2 ${activeTab === 'CONTROLS' ? 'bg-cyan-900/40 text-cyan-300 border-b-2 border-cyan-400' : 'hover:bg-cyan-900/20 text-gray-400'}`}>
            <Keyboard className="w-4 h-4" /> CONTROLS
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'AUDIO' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-cyan-400">Master Volume: {masterVol}%</label>
                <input type="range" min="0" max="100" value={masterVol} onChange={(e) => setMasterVol(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-cyan-400">Music Volume: {musicVol}%</label>
                <input type="range" min="0" max="100" value={musicVol} onChange={(e) => setMusicVol(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-cyan-400">SFX Volume: {sfxVol}%</label>
                <input type="range" min="0" max="100" value={sfxVol} onChange={(e) => setSfxVol(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            </div>
          )}

          {activeTab === 'GRAPHICS' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-cyan-400">Quality Preset</span>
                <select value={quality} onChange={(e) => setQuality(e.target.value)} className="bg-cyan-950 border border-cyan-800 text-cyan-100 p-2 rounded">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Ultra</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400">Shadows</span>
                <button onClick={() => setShadows(!shadows)} className={`px-4 py-1 border rounded ${shadows ? 'bg-cyan-600 border-cyan-400' : 'bg-transparent border-gray-600'}`}>{shadows ? 'ON' : 'OFF'}</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400">View Distance</span>
                <select value={viewDistance} onChange={(e) => setViewDistance(e.target.value)} className="bg-cyan-950 border border-cyan-800 text-cyan-100 p-2 rounded">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'CONTROLS' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-cyan-400">Mouse Sensitivity: {sensitivity}</label>
                <input type="range" min="1" max="100" value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400">Invert Y Axis</span>
                <button onClick={() => setInvertY(!invertY)} className={`px-4 py-1 border rounded ${invertY ? 'bg-cyan-600 border-cyan-400' : 'bg-transparent border-gray-600'}`}>{invertY ? 'ON' : 'OFF'}</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400">Sprint Toggle</span>
                <button onClick={() => setSprintToggle(!sprintToggle)} className={`px-4 py-1 border rounded ${sprintToggle ? 'bg-cyan-600 border-cyan-400' : 'bg-transparent border-gray-600'}`}>{sprintToggle ? 'ON' : 'OFF'}</button>
              </div>
              <div className="mt-8 pt-4 border-t border-cyan-900/30">
                <h3 className="text-cyan-600 mb-2 font-bold tracking-widest">KEYBINDS</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                  <div>Move: <span className="text-cyan-300">W A S D</span></div>
                  <div>Jump: <span className="text-cyan-300">SPACE</span></div>
                  <div>Interact: <span className="text-cyan-300">E</span></div>
                  <div>Inventory: <span className="text-cyan-300">TAB</span></div>
                  <div>Social: <span className="text-cyan-300">P</span></div>
                  <div>Party: <span className="text-cyan-300">O</span></div>
                  <div>Emotes: <span className="text-cyan-300">B</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-900/50 bg-black/40 flex justify-between items-center">
          <span className="text-green-400 text-sm flex items-center gap-1 opacity-0 transition-opacity" style={{ opacity: saved ? 1 : 0 }}>
            <Check className="w-4 h-4" /> Saved
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">CANCEL</button>
            <button onClick={handleSave} className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold tracking-widest rounded border border-cyan-500 transition-colors">
              APPLY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

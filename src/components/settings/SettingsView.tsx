import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Cpu, Volume2, Save, CheckCircle2 } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const SettingsView: React.FC = () => {
  const { addNotification } = useFactory();
  const [tempThreshold, setTempThreshold] = useState<number>(85);
  const [vibrationThreshold, setVibrationThreshold] = useState<number>(5.0);
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    addNotification("Settings Saved", "Platform sensor thresholds and automation rules updated successfully.", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan">
            <SettingsIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              PLATFORM & SENSOR THRESHOLD CONFIGURATION
            </h1>
            <p className="text-xs text-slate-400 font-mono">Autonomous AI Dispatch Parameters, Sensor Bounds & Audio Alerts</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono text-xs shadow-glow-cyan transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? "CONFIG SAVED!" : "SAVE CONFIGURATION"}</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sensor Thresholds */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            AI Sensor Alert Thresholds
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Machine Temp Alert Threshold:</span>
                <span className="text-amber-400 font-bold">{tempThreshold}°C</span>
              </div>
              <input
                type="range"
                min="60"
                max="110"
                value={tempThreshold}
                onChange={(e) => setTempThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-900"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Vibration Spike Warning (mm/s):</span>
                <span className="text-cyan-400 font-bold">{vibrationThreshold} mm/s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.5"
                value={vibrationThreshold}
                onChange={(e) => setVibrationThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Autonomous Task Dispatching
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Auto-Assign Nearest Technician</span>
                <span className="text-[10px] text-slate-400">Match technician via 2D spatial proximity</span>
              </div>
              <button
                onClick={() => setAutoDispatch(!autoDispatch)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  autoDispatch ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black shadow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

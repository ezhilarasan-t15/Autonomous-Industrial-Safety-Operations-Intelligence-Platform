import React from 'react';
import { Megaphone, Volume2, VolumeX } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const VoiceAnnouncer: React.FC = () => {
  const { currentAnnouncement, isVoiceMuted, setIsVoiceMuted, speakAnnouncement } = useFactory();

  return (
    <div className="bg-slate-950/80 border-b border-cyan-950 px-4 py-2 flex items-center justify-between gap-4 text-xs select-none">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono font-semibold text-[11px] shrink-0 shadow-glow-cyan">
          <Megaphone className="w-3.5 h-3.5 animate-bounce text-cyan-300" />
          <span>VOICE ANNOUNCEMENT</span>
        </div>

        {/* Audio Wave Equalizer Visualizer */}
        {!isVoiceMuted && (
          <div className="hidden sm:flex items-center gap-1 shrink-0 px-2">
            <span className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.45s' }} />
          </div>
        )}

        <div className="truncate text-slate-200 font-mono text-xs">
          {currentAnnouncement || "All factory systems operating within optimal thresholds."}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => speakAnnouncement(currentAnnouncement)}
          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-cyan-400 transition-all font-mono"
          title="Replay Voice Audio"
        >
          Replay Broadcast
        </button>
        <button
          onClick={() => setIsVoiceMuted(!isVoiceMuted)}
          className={`p-1 rounded text-slate-400 hover:text-white transition-all`}
        >
          {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>
      </div>
    </div>
  );
};

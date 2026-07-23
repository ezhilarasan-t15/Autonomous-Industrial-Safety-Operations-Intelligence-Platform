import React from 'react';
import { CircularGauge } from '../common/CircularGauge';
import { ShieldCheck } from 'lucide-react';

export const HealthScoreSection: React.FC = () => {
  const scores = [
    { label: 'Safety Index', score: 98, color: '#10B981' },
    { label: 'Power Grid', score: 91, color: '#F59E0B' },
    { label: 'Machinery', score: 94, color: '#00F0FF' },
    { label: 'Workers PPE', score: 97, color: '#3B82F6' },
    { label: 'Quality Control', score: 95, color: '#10B981' }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              FACTORY OVERALL HEALTH & SAFETY INDEX
            </h2>
            <p className="text-xs text-slate-400 font-mono">Weighted Real-time Telemetry Matrix</p>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className="text-2xl font-extrabold text-cyan-400">96.4%</span>
          <span className="text-[10px] text-emerald-400 block font-bold">NOMINAL COMPLIANCE</span>
        </div>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 py-2">
        {/* Main Large Score */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
          <CircularGauge
            score={96}
            label="Overall Index"
            size={130}
            strokeWidth={10}
            color="#00F0FF"
            sublabel="96.4%"
          />
        </div>

        {/* 5 Breakdown Gauges */}
        {scores.map((sc) => (
          <div key={sc.label} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <CircularGauge
              score={sc.score}
              label={sc.label}
              size={95}
              strokeWidth={7}
              color={sc.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

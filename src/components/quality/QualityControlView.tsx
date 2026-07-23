import React from 'react';
import { CheckCircle2, AlertOctagon, Cpu, ShieldCheck, Box, RefreshCw, BarChart2 } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const QualityControlView: React.FC = () => {
  const { quality } = useFactory();

  return (
    <div className="space-y-6 select-none">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 shadow-glow-green">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI QUALITY CONTROL & INGREDIENT ANALYTICS
            </h1>
            <p className="text-xs text-slate-400 font-mono">Conveyor Defect Inspection, Chemical Spectrometry & Spectrograph Verification</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>BATCH STATUS: {quality.status}</span>
        </div>
      </div>

      {/* Product & Batch Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Current Production Spec</span>
          <div className="text-sm font-bold text-white truncate">{quality.currentProduct}</div>
          <span className="text-[10px] font-mono text-cyan-400 block">Batch #: {quality.batchNumber}</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Overall Quality Score</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{quality.qualityScore}%</div>
          <span className="text-[10px] font-mono text-emerald-400">Target Threshold: &gt;98.0%</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Inspected Units</span>
          <div className="text-2xl font-extrabold text-white font-mono">{quality.totalInspected}</div>
          <span className="text-[10px] font-mono text-blue-400">Speed: 1,240 units/hr</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Rejected Defect Units</span>
          <div className="text-2xl font-extrabold text-red-400 font-mono">{quality.rejectedProducts}</div>
          <span className="text-[10px] font-mono text-red-400">Defect Rate: 1.12%</span>
        </div>
      </div>

      {/* Ingredient Spectrometry Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredient Breakdown Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
            <span>EXPECTED VS DETECTED INGREDIENTS SPECTROMETRY</span>
            <span className="text-xs text-cyan-400">Tolerance: ±0.5%</span>
          </h3>

          <div className="space-y-4 font-mono text-xs">
            {quality.expectedIngredients.map((exp, idx) => {
              const det = quality.detectedIngredients[idx] || exp;
              const isMatch = Math.abs(exp.percentage - det.percentage) <= 0.5;

              return (
                <div key={exp.name} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-200 font-semibold">
                    <span>{exp.name}</span>
                    <span className={isMatch ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {det.percentage}% (Expected: {exp.percentage}%)
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${exp.percentage}%` }}
                        title="Expected"
                      />
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${isMatch ? 'bg-emerald-400' : 'bg-red-400'}`}
                        style={{ width: `${det.percentage}%` }}
                        title="AI Detected"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              AI QUALITY RECOMMENDATION & DIAGNOSTICS
            </h3>

            <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2 text-xs font-mono">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">AI Diagnostic Report</span>
              <p className="text-slate-200 leading-relaxed font-semibold">
                "{quality.aiRecommendation}"
              </p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                Confidence Rating: <span className="text-emerald-400 font-bold">99.85%</span> • Calibration: Auto-Corrected
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Next Scheduled Calibration:</span>
              <span className="text-cyan-300 font-bold">02 Hours 14 Mins</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Laser Scanner Sensor:</span>
              <span className="text-emerald-400 font-bold">CALIBRATED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

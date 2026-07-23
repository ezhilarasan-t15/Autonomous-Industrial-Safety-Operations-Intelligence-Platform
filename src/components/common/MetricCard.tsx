import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  statusColor?: 'cyan' | 'green' | 'orange' | 'red' | 'blue';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon,
  statusColor = 'cyan',
  onClick
}) => {
  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-400 shadow-glow-cyan bg-cyan-950/20',
    green: 'border-emerald-500/30 text-emerald-400 shadow-glow-green bg-emerald-950/20',
    orange: 'border-amber-500/30 text-amber-400 shadow-glow-orange bg-amber-950/20',
    red: 'border-red-500/40 text-red-400 shadow-glow-red bg-red-950/30',
    blue: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 rounded-2xl border ${colorMap[statusColor]} transition-all duration-300 hover:scale-[1.02] cursor-pointer select-none group relative overflow-hidden`}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-all" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-2">
            <span>{value}</span>
            {change && (
              <span className={`text-xs font-semibold ${
                changeType === 'positive' ? 'text-emerald-400' :
                changeType === 'negative' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] text-slate-500 font-mono tracking-tight">{subtitle}</p>
          )}
        </div>

        <div className={`p-2.5 rounded-xl border ${colorMap[statusColor]} shrink-0 transition-transform group-hover:rotate-6`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

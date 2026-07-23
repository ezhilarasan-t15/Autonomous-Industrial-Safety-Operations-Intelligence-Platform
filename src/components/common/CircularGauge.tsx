import React from 'react';

interface CircularGaugeProps {
  score: number; // 0..100
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  sublabel?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  label,
  size = 140,
  strokeWidth = 10,
  color = '#00F0FF',
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#162032"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold font-mono text-white tracking-tight">{score}%</span>
          {sublabel && <span className="text-[9px] font-mono text-slate-400">{sublabel}</span>}
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase">{label}</span>
    </div>
  );
};

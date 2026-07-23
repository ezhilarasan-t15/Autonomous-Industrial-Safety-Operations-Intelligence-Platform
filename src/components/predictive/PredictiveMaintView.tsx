import React from 'react';
import { TrendingUp, Clock, AlertTriangle, ShieldCheck, Activity, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line } from 'recharts';

export const PredictiveMaintView: React.FC = () => {
  // Machine Health & Vibration trend data
  const healthTrendData = [
    { time: '08:00', M01: 99, M04: 85, M12: 70 },
    { time: '10:00', M01: 98, M04: 82, M12: 62 },
    { time: '12:00', M01: 98, M04: 78, M12: 55 },
    { time: '14:00', M01: 97, M04: 75, M12: 50 },
    { time: '16:00', M01: 98, M04: 70, M12: 48 },
    { time: '18:00', M01: 98, M04: 68, M12: 48 },
  ];

  // Fuel & Battery Usage timeline
  const powerTrendData = [
    { time: 'Mon', Fuel: 95, Battery: 98 },
    { time: 'Tue', Fuel: 90, Battery: 97 },
    { time: 'Wed', Fuel: 85, Battery: 96 },
    { time: 'Thu', Fuel: 78, Battery: 95 },
    { time: 'Fri', Fuel: 65, Battery: 94 },
    { time: 'Sat', Fuel: 45, Battery: 92 },
    { time: 'Sun', Fuel: 20, Battery: 90 },
  ];

  // Most Common Machine Failures (Pareto)
  const failureTypesData = [
    { name: 'Loose Screw', count: 28 },
    { name: 'Oil Leakage', count: 19 },
    { name: 'Bearing Wear', count: 14 },
    { name: 'High Temp', count: 11 },
    { name: 'Vibration Spike', count: 8 },
  ];

  // RUL (Remaining Useful Life) Forecast curve
  const rulForecastData = [
    { day: 'Day 0', M12: 48, M04: 68, M01: 98 },
    { day: 'Day 5', M12: 35, M04: 60, M01: 97 },
    { day: 'Day 10', M12: 20, M04: 52, M01: 95 },
    { day: 'Day 15', M12: 5, M04: 45, M01: 94 },
    { day: 'Day 20', M12: 0, M04: 38, M01: 92 },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan">
            <TrendingUp className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              PREDICTIVE MAINTENANCE & REMAINING USEFUL LIFE (RUL)
            </h1>
            <p className="text-xs text-slate-400 font-mono">Machine Health Degradation Forecasts, Pareto Failure Modes & Fuel Depletion</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
          AI PREDICTION CONFIDENCE: 98.4%
        </div>
      </div>

      {/* Top 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine Health Degradation Trend */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
            <span>Machine Health Degradation Timeline</span>
            <span className="text-xs text-slate-400">Telemetry Sampling: 2 Hrs</span>
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B101A', borderColor: '#00F0FF', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="M01" stroke="#10B981" strokeWidth={2} name="M01 (Alpha)" />
                <Line type="monotone" dataKey="M04" stroke="#F59E0B" strokeWidth={2} name="M04 (Lathe)" />
                <Line type="monotone" dataKey="M12" stroke="#EF4444" strokeWidth={3} name="M12 (Turbine)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel & UPS Battery Usage Trend */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
            <span>Power & Fuel Depletion Rate</span>
            <span className="text-xs text-amber-400 font-mono">Weekly Forecast</span>
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B101A', borderColor: '#F59E0B', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Fuel" stroke="#F59E0B" fill="rgba(245, 158, 11, 0.2)" strokeWidth={2} name="Fuel %" />
                <Area type="monotone" dataKey="Battery" stroke="#00F0FF" fill="rgba(0, 240, 255, 0.1)" strokeWidth={2} name="UPS %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Machine Failures (Pareto Bar Chart) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Most Common Industrial Failures (Historical Frequency)
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureTypesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B101A', borderColor: '#EF4444', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#EF4444" radius={[6, 6, 0, 0]} name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Remaining Useful Life (RUL) Prediction */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center justify-between">
            <span>Remaining Useful Life (RUL) Curve</span>
            <span className="text-xs text-red-400 font-bold">M12 Failure In 14 Days</span>
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rulForecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B101A', borderColor: '#00F0FF', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="M12" stroke="#EF4444" strokeWidth={3} dot={{ r: 5 }} name="M12 (Critical)" />
                <Line type="monotone" dataKey="M04" stroke="#F59E0B" strokeWidth={2} name="M04 (Warning)" />
                <Line type="monotone" dataKey="M01" stroke="#10B981" strokeWidth={2} name="M01 (Healthy)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

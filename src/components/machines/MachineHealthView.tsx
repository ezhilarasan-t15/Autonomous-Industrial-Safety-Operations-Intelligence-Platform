import React, { useState } from 'react';
import { Activity, Thermometer, Droplet, Video, UserCheck, Wrench, Search, Filter, ShieldCheck } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { Machine } from '../../types/factory';

export const MachineHealthView: React.FC = () => {
  const { machines, setSelectedCameraMachine, assignWorkerToMachine, workers } = useFactory();
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredMachines = machines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchFilter.toLowerCase()) || m.id.toLowerCase().includes(searchFilter.toLowerCase()) || m.zone.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableWorkers = workers.filter(w => w.status === 'Available');

  return (
    <div className="space-y-6 select-none">
      {/* Header & Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              REAL-TIME MACHINE HEALTH MONITORING
            </h1>
            <p className="text-xs text-slate-400 font-mono">Live telemetry, thermal metrics, oil levels & vibration frequency</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Machine ID or Zone..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['ALL', 'HEALTHY', 'WARNING', 'CRITICAL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === st 
                    ? 'bg-cyan-500 text-black font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMachines.map((m) => {
          const isCritical = m.status === 'Critical';
          const isWarning = m.status === 'Warning';

          return (
            <div
              key={m.id}
              className={`glass-panel p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] space-y-4 relative ${
                isCritical ? 'border-red-500/50 bg-red-950/20 shadow-glow-red' :
                isWarning ? 'border-amber-500/40 bg-amber-950/20 shadow-glow-orange' :
                'border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {m.id}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{m.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{m.zone}</span>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isCritical ? 'bg-red-950 text-red-400 border-red-500/60 animate-pulse' :
                  isWarning ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
                  'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                }`}>
                  {m.status}
                </span>
              </div>

              {/* Health Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Health Score</span>
                  <span className={`font-bold ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {m.health}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${m.health}%` }}
                  />
                </div>
              </div>

              {/* Readouts Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-400" /> Temp
                  </span>
                  <span className={m.temperature > 80 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                    {m.temperature}°C
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Droplet className="w-3 h-3 text-cyan-400" /> Oil
                  </span>
                  <span className={m.oilLevel < 25 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                    {m.oilLevel}%
                  </span>
                </div>
              </div>

              {/* Issues Pill */}
              {m.issues.length > 0 && (
                <div className="p-2 rounded-lg bg-red-950/40 border border-red-900/60 text-[10px] font-mono text-red-300 space-y-0.5">
                  <span className="font-bold text-red-400 uppercase block">Anomalies Detected:</span>
                  {m.issues.map((iss, idx) => (
                    <div key={idx}>• {iss}</div>
                  ))}
                </div>
              )}

              {/* Assigned technician readout */}
              {m.assignedWorkerName && (
                <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/30 flex items-center justify-between">
                  <span>Assigned: {m.assignedWorkerName}</span>
                  <span className="text-amber-400 font-bold">{m.estimatedRepairTime}</span>
                </div>
              )}

              {/* Buttons Action Group */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCameraMachine(m)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>

                {!m.assignedWorkerId && availableWorkers.length > 0 && (
                  <button
                    onClick={() => assignWorkerToMachine(m.id, availableWorkers[0].id)}
                    className="flex-1 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

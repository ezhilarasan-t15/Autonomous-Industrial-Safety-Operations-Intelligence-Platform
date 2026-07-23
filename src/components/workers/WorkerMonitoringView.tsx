import React, { useState } from 'react';
import { Users, ShieldCheck, AlertTriangle, Check, X, HardHat, Eye, Shield, Search, UserCheck } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { Worker, PPEChecklist } from '../../types/factory';

export const WorkerMonitoringView: React.FC = () => {
  const { workers, speakAnnouncement, addNotification } = useFactory();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase()) || w.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pageWorker = (w: Worker) => {
    const msg = `Attention Worker ${w.id} ${w.name}: Please report to control room station immediately.`;
    speakAnnouncement(msg);
    addNotification("Worker Paged", msg, "info");
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Users className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              WORKER MONITORING & LIVE AI PPE COMPLIANCE
            </h1>
            <p className="text-xs text-slate-400 font-mono">Autonomous Computer Vision Safety Helmet, Gloves, Shoes & Goggles Verification</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Worker ID or Dept..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['ALL', 'AVAILABLE', 'BUSY', 'ON BREAK'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === st ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredWorkers.map((w) => {
          const hasPpeViolation = !w.ppe.helmet || !w.ppe.gloves || !w.ppe.shoes || !w.ppe.jacket || !w.ppe.goggles;

          return (
            <div
              key={w.id}
              className={`glass-panel p-4 rounded-2xl border transition-all duration-300 space-y-4 ${
                hasPpeViolation 
                  ? 'border-amber-500/50 bg-amber-950/20 shadow-glow-orange' 
                  : 'border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {/* Profile Top Info */}
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40 shadow-glow-cyan"
                  />
                  <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black ${
                    w.status === 'Available' ? 'bg-emerald-400' :
                    w.status === 'Busy' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">{w.name}</h3>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      {w.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{w.department}</p>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                    w.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                    w.status === 'Busy' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                    'bg-slate-900 text-slate-400 border border-slate-700'
                  }`}>
                    {w.status}
                  </span>
                </div>
              </div>

              {/* Location & Task info */}
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Current Zone:</span>
                  <span className="text-cyan-300 font-semibold">{w.currentRoom}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Current Task:</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[140px]">{w.currentTask}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Supervisor:</span>
                  <span className="text-slate-300">{w.supervisor}</span>
                </div>
              </div>

              {/* PPE Verification Matrix */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>AI PPE SAFETY CHECK</span>
                  {hasPpeViolation ? (
                    <span className="text-amber-400 font-bold animate-pulse flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> VIOLATION
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> COMPLIANT
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
                  {([
                    { label: 'Helmet', key: 'helmet' },
                    { label: 'Gloves', key: 'gloves' },
                    { label: 'Shoes', key: 'shoes' },
                    { label: 'Jacket', key: 'jacket' },
                    { label: 'Goggles', key: 'goggles' },
                  ] as const).map((item) => {
                    const isOk = w.ppe[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`p-1 rounded text-center border flex flex-col items-center justify-center ${
                          isOk
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                            : 'bg-red-950/50 border-red-500/60 text-red-400 animate-pulse font-bold'
                        }`}
                        title={`${item.label}: ${isOk ? 'OK' : 'MISSING'}`}
                      >
                        {isOk ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span className="text-[8px] truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => pageWorker(w)}
                className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 transition-all font-semibold"
              >
                Page Worker Audio
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

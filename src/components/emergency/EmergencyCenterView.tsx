import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, Radio, CheckCircle, Navigation, Users, Clock, Octagon } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { EmergencyType } from '../../types/factory';

export const EmergencyCenterView: React.FC = () => {
  const { emergency, triggerEmergency, resolveEmergency } = useFactory();

  const emergencyTypes: { type: EmergencyType; label: string; icon: React.ReactNode; zone: string }[] = [
    { type: 'Fire', label: 'Fire Outbreak', icon: <Flame className="w-5 h-5 text-red-400" />, zone: 'Chemical Room' },
    { type: 'Smoke', label: 'Heavy Smoke', icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, zone: 'Packing Area' },
    { type: 'Gas Leak', label: 'Toxic Gas Leak', icon: <Octagon className="w-5 h-5 text-purple-400" />, zone: 'Chemical Room' },
    { type: 'Explosion', label: 'Turbine Explosion', icon: <ShieldAlert className="w-5 h-5 text-red-500" />, zone: 'Assembly Line' },
    { type: 'Medical Emergency', label: 'Medical Event', icon: <Radio className="w-5 h-5 text-blue-400" />, zone: 'Warehouse' },
    { type: 'Worker Injury', label: 'Worker Injury', icon: <Users className="w-5 h-5 text-emerald-400" />, zone: 'Control Room' }
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            emergency.active ? 'bg-red-950 text-red-400 border-red-500/60 shadow-glow-red animate-pulse' : 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              EMERGENCY RESPONSE & SMART EVACUATION CENTER
            </h1>
            <p className="text-xs text-slate-400 font-mono">Autonomous Hazard Detection, Gate Blocking & Real-time Evacuation Routing</p>
          </div>
        </div>

        {emergency.active ? (
          <button
            onClick={resolveEmergency}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold font-mono text-xs shadow-glow-green transition-all"
          >
            RESOLVE EMERGENCY ALARM
          </button>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL ZONES SAFE (NORMAL STATE)</span>
          </div>
        )}
      </div>

      {/* FULL SCREEN / LARGE ANIMATED ALARM BANNER WHEN ACTIVE */}
      {emergency.active && (
        <div className="glass-panel-danger p-6 rounded-2xl border-2 border-red-500 animate-pulse flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow-red">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-red-900 border border-red-400 text-red-100 animate-bounce">
              <Flame className="w-10 h-10 text-red-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-widest bg-red-950 px-2 py-0.5 rounded border border-red-500/60">
                LEVEL: {emergency.level} HAZARD
              </span>
              <h2 className="text-2xl font-extrabold text-white uppercase font-mono mt-1">
                🔴 CRITICAL EMERGENCY: {emergency.type} IN {emergency.zone}
              </h2>
              <p className="text-xs text-red-200 font-mono mt-1">
                Triggered at {emergency.timestamp || "22:58"} • Sirens Active • Autonomous Exits Blocked
              </p>
            </div>
          </div>

          {/* Quick Evacuation Stats */}
          <div className="flex items-center gap-4 bg-black/70 p-4 rounded-xl border border-red-500/40 font-mono text-center shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Evacuated</span>
              <span className="text-xl font-bold text-emerald-400">{emergency.evacuatedCount}</span>
            </div>
            <div className="border-x border-slate-800 px-4">
              <span className="text-[10px] text-slate-400 block uppercase">Remaining</span>
              <span className="text-xl font-bold text-amber-400">{emergency.remainingCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Rescue Required</span>
              <span className="text-xl font-bold text-red-400 animate-bounce">{emergency.rescueRequiredCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Emergency Triggers Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Simulate Industrial Hazard Test Triggers
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {emergencyTypes.map((item) => (
            <button
              key={item.type}
              onClick={() => triggerEmergency(item.type, item.zone)}
              className={`p-4 rounded-2xl border text-left space-y-2 transition-all group ${
                emergency.active && emergency.type === item.type
                  ? 'bg-red-950 border-red-500 shadow-glow-red'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-red-500/40'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 inline-block group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">{item.label}</div>
                <div className="text-[10px] font-mono text-slate-400">{item.zone}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Evacuation Routing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exits Status Cards */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            FACTORY EXITS CONTROL MATRIX
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              { id: "Exit 1", location: "Assembly & Control North Gate", safe: !emergency.blockedExits.includes("Exit 1") },
              { id: "Exit 2", location: "Packing & Chemical East Gate", safe: !emergency.blockedExits.includes("Exit 2") },
              { id: "Exit 3", location: "Warehouse South Gate", safe: !emergency.blockedExits.includes("Exit 3") },
            ].map((ex) => (
              <div
                key={ex.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  ex.safe
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-950/50 border-red-500/60 text-red-400 animate-pulse font-bold'
                }`}
              >
                <div>
                  <span className="font-bold text-sm text-white block">{ex.id}</span>
                  <span className="text-[10px] text-slate-400">{ex.location}</span>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                  ex.safe ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-red-950 text-red-400 border-red-500/80'
                }`}>
                  {ex.safe ? "GATE OPEN" : "BLOCKED BY HAZARD"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Zone Evacuation Routes Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
            <span>AI EVACUATION ROUTE RECOMMENDATIONS</span>
            <span className="text-xs text-cyan-400">Est. Evacuation Time: {emergency.estimatedEvacuationMinutes || 0} Mins</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Zone Location</th>
                  <th className="py-2.5 px-3">Recommended Exit</th>
                  <th className="py-2.5 px-3">Route Safety</th>
                  <th className="py-2.5 px-3">Directional Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {emergency.evacuationRoutes.map((route, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-semibold text-slate-200">{route.zone}</td>
                    <td className="py-3 px-3 text-cyan-400 font-bold">{route.targetExit}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${
                        route.safe ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/40'
                      }`}>
                        {route.safe ? 'CLEAR' : 'REROUTED'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      Follow glowing blue floor arrows to {route.targetExit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

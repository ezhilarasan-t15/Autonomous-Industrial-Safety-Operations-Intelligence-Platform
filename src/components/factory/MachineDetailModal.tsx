import React from 'react';
import { X, Activity, Thermometer, Droplet, Wrench, User, Clock, AlertTriangle, Video, ShieldCheck } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { Machine } from '../../types/factory';

interface MachineDetailModalProps {
  machine: Machine | null;
  onClose: () => void;
}

export const MachineDetailModal: React.FC<MachineDetailModalProps> = ({ machine, onClose }) => {
  const { setSelectedCameraMachine, assignWorkerToMachine, workers } = useFactory();

  if (!machine) return null;

  const availableWorkers = workers.filter(w => w.status === 'Available');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B101A] border border-cyan-500/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl shadow-cyan-950/50 space-y-0 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              machine.status === 'Critical' ? 'bg-red-950 text-red-400 border-red-500/50 shadow-glow-red' :
              machine.status === 'Warning' ? 'bg-amber-950 text-amber-400 border-amber-500/50 shadow-glow-orange' :
              'bg-emerald-950 text-emerald-400 border-emerald-500/40 shadow-glow-green'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">{machine.name}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  {machine.id}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">Zone: <span className="text-slate-200">{machine.zone}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Grid & Status */}
        <div className="p-5 space-y-4">
          {/* Top Health Meter */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase">Overall Machine Health</span>
              <span className={`font-bold text-sm ${
                machine.health > 85 ? 'text-emerald-400' :
                machine.health > 60 ? 'text-amber-400' : 'text-red-400 animate-pulse'
              }`}>
                {machine.health}% ({machine.status})
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  machine.health > 85 ? 'bg-emerald-400' :
                  machine.health > 60 ? 'bg-amber-400' : 'bg-red-500'
                }`}
                style={{ width: `${machine.health}%` }}
              />
            </div>
          </div>

          {/* 3 Telemetry Gauges: Temp, Oil, Vibration */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Temperature</span>
              </div>
              <div className={`text-lg font-bold font-mono ${machine.temperature > 85 ? 'text-red-400' : 'text-slate-100'}`}>
                {machine.temperature}°C
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase">
                <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Oil Level</span>
              </div>
              <div className={`text-lg font-bold font-mono ${machine.oilLevel < 25 ? 'text-red-400' : 'text-slate-100'}`}>
                {machine.oilLevel}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-1">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bearing State</span>
              </div>
              <div className="text-sm font-bold font-mono text-cyan-400">
                {machine.bearingCondition}
              </div>
            </div>
          </div>

          {/* Issues & Assigned Worker Section */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Current Issues
              </span>
              {machine.issues.length === 0 ? (
                <span className="text-emerald-400 font-mono text-xs block">No Active Anomalies</span>
              ) : (
                <div className="space-y-1">
                  {machine.issues.map((iss, i) => (
                    <span key={i} className="block text-red-400 font-mono text-[11px] bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
                      • {iss}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Assigned Maintenance
              </span>
              {machine.assignedWorkerName ? (
                <div>
                  <div className="font-bold text-slate-100">{machine.assignedWorkerName}</div>
                  <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Est. Repair: {machine.estimatedRepairTime || "15 Mins"}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-slate-500 font-mono text-[11px] block">Unassigned</span>
                  {availableWorkers.length > 0 && (
                    <button
                      onClick={() => assignWorkerToMachine(machine.id, availableWorkers[0].id)}
                      className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px] font-mono transition-all w-full"
                    >
                      Assign {availableWorkers[0].name}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance History */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between font-mono">
            <span className="text-slate-400">Last Preventative Service:</span>
            <span className="text-cyan-400 font-bold">{machine.lastMaintenance}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedCameraMachine(machine);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-glow-cyan"
          >
            <Video className="w-4 h-4" />
            VIEW AI CAMERA FEED
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold font-mono text-xs transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

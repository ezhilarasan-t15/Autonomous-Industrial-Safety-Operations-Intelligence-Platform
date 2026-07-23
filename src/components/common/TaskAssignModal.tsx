import React from 'react';
import { CheckCircle, Clock, AlertTriangle, UserCheck, Shield, X, MapPin, Wrench } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { TaskAssignment } from '../../types/factory';

interface TaskAssignModalProps {
  task: TaskAssignment | null;
  onClose: () => void;
}

export const TaskAssignModal: React.FC<TaskAssignModalProps> = ({ task, onClose }) => {
  const { updateTaskStatus, setSelectedMachineId, setActiveNav } = useFactory();

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B101A] border border-cyan-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-cyan-950/50 space-y-0 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/40">
              <Wrench className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">WORKER TASK DISPATCH</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  task.priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/60' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}>
                  {task.priority} PRIORITY
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">Task ID: {task.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Issue Summary Banner */}
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-red-300 uppercase font-mono">Detected Anomaly</div>
              <p className="text-xs text-slate-200 font-semibold">{task.issue}</p>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Target: <span className="text-cyan-400 font-bold">{task.machineName} ({task.machineId})</span>
              </div>
            </div>
          </div>

          {/* Assigned Worker Details Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <UserCheck className="w-4 h-4" />
                NEAREST AVAILABLE TECHNICIAN
              </span>
              <span>Matched via AI Proximity</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">Worker Name</span>
                <span className="font-bold text-slate-100">{task.workerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">Employee ID</span>
                <span className="font-mono text-cyan-400 font-bold">{task.workerId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">Distance to Machine</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {task.distanceMeters} Meters
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">Estimated Repair Time</span>
                <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.estimatedRepairTime}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 font-mono block">Supervisor</span>
                <span className="text-slate-300 font-semibold">{task.supervisorName}</span>
              </div>
            </div>
          </div>

          {/* Status Progression Workflow */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Current Task Status:</span>
            <span className={`px-2.5 py-1 rounded font-bold ${
              task.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
              task.status === 'In Progress' ? 'bg-blue-950 text-blue-400 border border-blue-500/40 animate-pulse' :
              'bg-amber-950 text-amber-400 border border-amber-500/40'
            }`}>
              {task.status}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedMachineId(task.machineId);
              setActiveNav('machine_health');
              onClose();
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 transition-all"
          >
            Track Machine
          </button>

          <div className="flex items-center gap-2">
            {task.status === 'Pending' && (
              <button
                onClick={() => updateTaskStatus(task.id, 'In Progress')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all"
              >
                ACCEPT TASK
              </button>
            )}

            {task.status === 'In Progress' && (
              <button
                onClick={() => {
                  updateTaskStatus(task.id, 'Resolved');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                MARK RESOLVED
              </button>
            )}

            {task.status === 'Resolved' && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono transition-all"
              >
                CLOSE DISPATCH
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

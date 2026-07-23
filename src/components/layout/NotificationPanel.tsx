import React from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle2, AlertOctagon, ExternalLink } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification, setSelectedMachineId, setActiveNav } = useFactory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-[#0B101A]/95 border-l border-cyber-border z-50 backdrop-blur-xl shadow-2xl flex flex-col justify-between transition-all animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2 font-semibold text-sm text-slate-100">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span>Live Notification Feed</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            {notifications.length} Active
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No active notifications in stream
          </div>
        ) : (
          notifications.map((notif) => {
            let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
            let borderColor = "border-slate-800";
            let bgGlow = "bg-slate-900/40";

            if (notif.type === 'critical') {
              icon = <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />;
              borderColor = "border-red-500/40";
              bgGlow = "bg-red-950/30 shadow-glow-red";
            } else if (notif.type === 'warning') {
              icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
              borderColor = "border-amber-500/40";
              bgGlow = "bg-amber-950/30";
            } else if (notif.type === 'success') {
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
              borderColor = "border-emerald-500/40";
              bgGlow = "bg-emerald-950/20";
            }

            return (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border ${borderColor} ${bgGlow} transition-all space-y-2 relative group`}
              >
                <button
                  onClick={() => dismissNotification(notif.id)}
                  className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>

                <div className="flex items-start gap-2.5">
                  {icon}
                  <div className="space-y-1 pr-4">
                    <div className="text-xs font-semibold text-slate-200">{notif.title}</div>
                    <p className="text-[11px] text-slate-400 leading-snug">{notif.message}</p>
                    <div className="text-[10px] font-mono text-slate-500 pt-1">{notif.timestamp}</div>
                  </div>
                </div>

                {notif.machineId && (
                  <button
                    onClick={() => {
                      setSelectedMachineId(notif.machineId!);
                      setActiveNav('machine_health');
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:underline pt-1"
                  >
                    <span>Inspect {notif.machineId}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
        <span className="text-[10px] font-mono text-slate-500">Autonomous Sensor Stream • Refreshed live</span>
      </div>
    </div>
  );
};

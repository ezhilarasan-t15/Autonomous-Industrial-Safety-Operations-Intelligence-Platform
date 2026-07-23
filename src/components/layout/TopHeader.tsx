import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Volume2, 
  VolumeX, 
  Bell, 
  Settings as SettingsIcon, 
  User, 
  Radio, 
  AlertTriangle 
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const TopHeader: React.FC = () => {
  const { 
    emergency, 
    triggerEmergency, 
    resolveEmergency, 
    isVoiceMuted, 
    setIsVoiceMuted, 
    notifications,
    setActiveNav 
  } = useFactory();

  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showNotifDrawer, setShowNotifDrawer] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-[#080D16]/90 backdrop-blur-md border-b border-cyber-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 shadow-glow-cyan">
          <ShieldAlert className="w-6 h-6 text-cyan-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wider text-white">SafeVision <span className="text-cyan-400 font-mono">AI</span></span>
            <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              v4.2 PRO
            </span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">Autonomous Industrial Safety & Operations Intelligence Platform</p>
        </div>
      </div>

      {/* Center Emergency Banner / Status Indicator */}
      <div className="hidden md:flex items-center gap-4">
        {emergency.active ? (
          <div className="flex items-center gap-3 bg-red-950/80 border border-red-500/60 text-red-200 px-4 py-1.5 rounded-full animate-pulse shadow-glow-red">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-red-400">
              EMERGENCY ACTIVE: {emergency.type} ({emergency.zone})
            </span>
            <button 
              onClick={resolveEmergency}
              className="ml-2 text-[11px] bg-red-600 hover:bg-red-500 text-white font-semibold px-2.5 py-0.5 rounded shadow transition-all"
            >
              RESOLVE ALARM
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FACTORY STATUS: <strong className="text-emerald-300">ONLINE (100% NOMINAL)</strong></span>
          </div>
        )}

        {/* Quick Emergency Simulation Switch */}
        {!emergency.active && (
          <button
            onClick={() => triggerEmergency("Fire", "Chemical Room")}
            className="flex items-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/60 px-3 py-1 rounded-lg transition-all"
            title="Simulate Fire Alarm for testing evacuation routes"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Test Emergency</span>
          </button>
        )}
      </div>

      {/* Right Tools: Time, Voice Mute, Profile, Settings */}
      <div className="flex items-center gap-4">
        {/* Clock & Date */}
        <div className="hidden xl:flex flex-col text-right font-mono border-r border-slate-800 pr-4">
          <span className="text-sm font-bold text-cyan-400 tracking-wider">{timeStr}</span>
          <span className="text-[10px] text-slate-400 tracking-tight">{dateStr}</span>
        </div>

        {/* Voice Announcer Toggle */}
        <button
          onClick={() => setIsVoiceMuted(!isVoiceMuted)}
          className={`p-2 rounded-lg border transition-all ${
            isVoiceMuted 
              ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300' 
              : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 shadow-glow-cyan hover:bg-cyan-900/40'
          }`}
          title={isVoiceMuted ? "Voice Announcements Muted" : "Voice Announcements Active"}
        >
          {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setActiveNav('dashboard')}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all relative"
            title="Live Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Settings button */}
        <button
          onClick={() => setActiveNav('settings')}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 transition-all hidden sm:block"
          title="Platform Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
            <User className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200">Cmdr. Vance</div>
            <div className="text-[10px] font-mono text-cyan-400">Chief Safety Officer</div>
          </div>
        </div>
      </div>
    </header>
  );
};

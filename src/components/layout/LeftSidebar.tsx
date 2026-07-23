import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileText,
  Bot,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { NavModule } from '../../types/factory';

interface NavItem {
  id: NavModule;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const LeftSidebar: React.FC = () => {
  const { activeNav, setActiveNav, emergency, machines } = useFactory();

  const warningCount = machines.filter(m => m.status === 'Warning' || m.status === 'Critical').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'live_factory',
      label: 'Live Factory',
      icon: <MapPin className="w-4 h-4" />,
      badge: '2D MAP',
      badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
    },
    {
      id: 'machine_health',
      label: 'Machine Health',
      icon: <Activity className="w-4 h-4" />,
      badge: warningCount > 0 ? `${warningCount} ALERT` : undefined,
      badgeColor: warningCount > 0 ? 'bg-amber-950 text-amber-400 border-amber-500/40' : undefined
    },
    {
      id: 'workers',
      label: 'Workers & PPE',
      icon: <Users className="w-4 h-4" />,
      badge: 'PPE AI',
      badgeColor: 'bg-blue-950 text-blue-400 border-blue-500/40'
    },
    {
      id: 'quality_control',
      label: 'Quality Control',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      id: 'emergency',
      label: 'Emergency Center',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: emergency.active ? 'ACTIVE' : 'SAFE',
      badgeColor: emergency.active ? 'bg-red-950 text-red-400 border-red-500/60 animate-pulse' : 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'power',
      label: 'Power Management',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'predictive',
      label: 'Predictive Maint.',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Reports Generator',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'ai_assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4" />,
      badge: 'LIVE',
      badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-64 bg-[#080D16]/95 border-r border-cyber-border flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* Upper Navigation List */}
      <div className="py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          Control Matrix
        </div>

        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lower Engine Status Widget */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="p-3 rounded-xl bg-cyber-card/80 border border-slate-800/80 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>AI NEURAL ENGINE</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full w-[94%] animate-pulse" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Latency: 12ms</span>
            <span>Accuracy: 99.8%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Users,
  Camera,
  Box,
  Zap,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { MetricCard } from '../common/MetricCard';
import { HealthScoreSection } from './HealthScoreSection';
import { LiveFactoryMap } from '../factory/LiveFactoryMap';

export const DashboardView: React.FC = () => {
  const { machines, workers, power, emergency, setActiveNav } = useFactory();

  const runningMachinesCount = machines.filter(m => m.status === 'Healthy' || m.status === 'Warning').length;
  const criticalCount = machines.filter(m => m.status === 'Critical').length;

  return (
    <div className="space-y-6 select-none">
      {/* Top 8 Animated Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MetricCard
          title="Factory Health"
          value="96%"
          statusColor="cyan"
          change="+1.2%"
          changeType="positive"
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          onClick={() => setActiveNav('dashboard')}
        />

        <MetricCard
          title="Safety Score"
          value="98%"
          statusColor="green"
          change="Optimal"
          changeType="positive"
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          onClick={() => setActiveNav('emergency')}
        />

        <MetricCard
          title="Running Machines"
          value={`${runningMachinesCount}/${machines.length}`}
          statusColor={criticalCount > 0 ? 'orange' : 'green'}
          subtitle={criticalCount > 0 ? `${criticalCount} Alert` : 'All Systems Active'}
          icon={<Cpu className="w-5 h-5 text-amber-400" />}
          onClick={() => setActiveNav('machine_health')}
        />

        <MetricCard
          title="Active Workers"
          value={workers.length}
          statusColor="blue"
          subtitle="42 On-Duty"
          icon={<Users className="w-5 h-5 text-blue-400" />}
          onClick={() => setActiveNav('workers')}
        />

        <MetricCard
          title="Cameras Online"
          value="28/28"
          statusColor="cyan"
          subtitle="AI Vision 60FPS"
          icon={<Camera className="w-5 h-5 text-cyan-400" />}
          onClick={() => setActiveNav('live_factory')}
        />

        <MetricCard
          title="Production"
          value="1,240"
          subtitle="Units/Hour"
          statusColor="green"
          change="+4.5%"
          changeType="positive"
          icon={<Box className="w-5 h-5 text-emerald-400" />}
          onClick={() => setActiveNav('quality_control')}
        />

        <MetricCard
          title="Power Status"
          value={`${power.generatorFuel}%`}
          statusColor={power.generatorFuel < 20 ? 'red' : 'green'}
          subtitle={power.generatorFuel < 20 ? 'Fuel Alert' : 'Grid Nominal'}
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          onClick={() => setActiveNav('power')}
        />

        <MetricCard
          title="AI Monitor"
          value="99.9%"
          statusColor="cyan"
          subtitle="12ms Latency"
          icon={<Radio className="w-5 h-5 text-cyan-400" />}
          onClick={() => setActiveNav('ai_assistant')}
        />
      </div>

      {/* Circular Health Score Section */}
      <HealthScoreSection />

      {/* Main Live 2D Factory Map */}
      <LiveFactoryMap />
    </div>
  );
};

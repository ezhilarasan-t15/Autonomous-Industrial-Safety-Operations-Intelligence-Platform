import React from 'react';
import { Zap, Fuel, BatteryCharging, Clock, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { CircularGauge } from '../common/CircularGauge';

export const PowerManagementView: React.FC = () => {
  const { power, simulateLowFuelToggle } = useFactory();

  const isLowFuel = power.generatorFuel < 20;

  return (
    <div className="space-y-6 select-none">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/30 shadow-glow-orange">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              POWER & GENERATOR MANAGEMENT
            </h1>
            <p className="text-xs text-slate-400 font-mono">Diesel Turbine Fuel Reserves, UPS Battery Health & Load Balancing</p>
          </div>
        </div>

        {/* Action Toggle */}
        <button
          onClick={simulateLowFuelToggle}
          className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            isLowFuel
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-400'
              : 'bg-amber-950 hover:bg-amber-900 text-amber-400 border-amber-500/40'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{isLowFuel ? "RESET FUEL TO 88%" : "SIMULATE LOW FUEL (12%)"}</span>
        </button>
      </div>

      {/* LOW FUEL ANIMATED CRITICAL WARNING BANNER */}
      {isLowFuel && (
        <div className="p-5 rounded-2xl bg-red-950/80 border-2 border-red-500 shadow-glow-red animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-900 border border-red-400 text-red-100">
              <AlertTriangle className="w-8 h-8 animate-bounce text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-extrabold text-red-200 uppercase font-mono tracking-wider">
                  ⚠️ CRITICAL WARNING: GENERATOR FUEL LEVEL AT {power.generatorFuel}%
                </h3>
              </div>
              <p className="text-xs text-red-300 font-mono mt-1">
                Estimated Emergency Backup Duration: <strong className="text-white underline">{power.estimatedBackupMinutes} Minutes</strong> remaining.
              </p>
            </div>
          </div>

          <div className="bg-black/60 p-3 rounded-xl border border-red-500/40 text-center font-mono shrink-0">
            <span className="text-[10px] text-red-400 uppercase block font-bold">AI Recommendation</span>
            <span className="text-xs font-bold text-white">REFILL FUEL TANK BEFORE POWER FAILURE</span>
          </div>
        </div>
      )}

      {/* Radial Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Generator Fuel Gauge */}
        <div className={`glass-panel p-6 rounded-2xl border flex flex-col items-center justify-between text-center space-y-4 ${
          isLowFuel ? 'border-red-500/60 bg-red-950/30 shadow-glow-red' : 'border-amber-500/30'
        }`}>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <Fuel className="w-4 h-4" />
            <span>Generator Fuel Reserve</span>
          </div>

          <CircularGauge
            score={power.generatorFuel}
            label="Fuel Level"
            size={160}
            strokeWidth={12}
            color={isLowFuel ? '#EF4444' : '#F59E0B'}
            sublabel={`${power.generatorFuel}% Capacity`}
          />

          <div className="w-full pt-4 border-t border-slate-800 text-xs font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Fuel Consumption Rate:</span>
              <span className="text-amber-400 font-bold">4.2 L/hr</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Backup:</span>
              <span className={isLowFuel ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {power.estimatedBackupMinutes} Mins
              </span>
            </div>
          </div>
        </div>

        {/* UPS Battery Gauge */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col items-center justify-between text-center space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <BatteryCharging className="w-4 h-4" />
            <span>UPS Battery Bank</span>
          </div>

          <CircularGauge
            score={power.upsBattery}
            label="UPS Reserve"
            size={160}
            strokeWidth={12}
            color="#00F0FF"
            sublabel={`${power.upsBattery}% Charged`}
          />

          <div className="w-full pt-4 border-t border-slate-800 text-xs font-mono space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Battery Health:</span>
              <span className="text-emerald-400 font-bold">{power.batteryHealth}%</span>
            </div>
            <div className="flex justify-between">
              <span>Inverter Voltage:</span>
              <span className="text-cyan-400 font-bold">415V 3-Phase</span>
            </div>
          </div>
        </div>

        {/* Power Load Consumption Card */}
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
            <Zap className="w-4 h-4" />
            <span>Active Power Draw</span>
          </div>

          <div className="text-center space-y-1 my-auto">
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {power.powerConsumption} <span className="text-lg text-cyan-400 font-normal">kW</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Current Grid Load</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 text-xs font-mono space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Grid Status:</span>
              <span className="text-emerald-400 font-bold">GRID ONLINE (100%)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Solar Array Output:</span>
              <span className="text-amber-400 font-bold">420 kW (Active)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

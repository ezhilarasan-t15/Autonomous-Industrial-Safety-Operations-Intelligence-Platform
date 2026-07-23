import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Users, Radio, Shield, AlertTriangle, Eye, Layers } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';
import { MachineDetailModal } from './MachineDetailModal';
import { Machine } from '../../types/factory';

export const LiveFactoryMap: React.FC = () => {
  const { machines, workers, emergency, setSelectedMachineId } = useFactory();
  const [activeMachineDetail, setActiveMachineDetail] = useState<Machine | null>(null);
  const [showEvacuationOverlay, setShowEvacuationOverlay] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 2D HTML5 Canvas rendering for corridor paths, zone labels, exit gates & evacuation arrows
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let arrowOffset = 0;

    const renderMap = () => {
      arrowOffset = (arrowOffset + 0.5) % 20;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Dark Control Room Canvas Background
      ctx.fillStyle = '#060B12';
      ctx.fillRect(0, 0, width, height);

      // Floor Grid Pattern
      ctx.strokeStyle = '#0E1726';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Zone Boundary Layout Definitions
      const zones = [
        { label: "CONTROL ROOM", x: 0.05, y: 0.05, w: 0.25, h: 0.35, color: "rgba(0, 240, 255, 0.08)", border: "#00F0FF" },
        { label: "ASSEMBLY LINE", x: 0.32, y: 0.05, w: 0.38, h: 0.45, color: "rgba(59, 130, 246, 0.08)", border: "#3B82F6" },
        { label: "PACKING AREA", x: 0.72, y: 0.05, w: 0.24, h: 0.45, color: "rgba(16, 185, 129, 0.08)", border: "#10B981" },
        { label: "GENERATOR ROOM", x: 0.05, y: 0.45, w: 0.25, h: 0.50, color: "rgba(245, 158, 11, 0.08)", border: "#F59E0B" },
        { label: "CHEMICAL ROOM", x: 0.32, y: 0.55, w: 0.38, h: 0.40, color: "rgba(239, 68, 68, 0.08)", border: "#EF4444" },
        { label: "WAREHOUSE", x: 0.72, y: 0.55, w: 0.24, h: 0.40, color: "rgba(168, 85, 247, 0.08)", border: "#A855F7" }
      ];

      // Draw Zone Regions
      zones.forEach(z => {
        const zX = z.x * width;
        const zY = z.y * height;
        const zW = z.w * width;
        const zH = z.h * height;

        ctx.fillStyle = z.color;
        ctx.fillRect(zX, zY, zW, zH);

        ctx.strokeStyle = z.border;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(zX, zY, zW, zH);
        ctx.setLineDash([]);

        // Zone Name Label
        ctx.fillStyle = z.border;
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText(z.label, zX + 12, zY + 22);
      });

      // Exit Gate Markers (Exit 1, Exit 2, Exit 3)
      const exits = [
        { name: "Exit 1", x: 0.02, y: 0.25, isBlocked: emergency.blockedExits.includes("Exit 1") },
        { name: "Exit 2", x: 0.50, y: 0.02, isBlocked: emergency.blockedExits.includes("Exit 2") },
        { name: "Exit 3", x: 0.98, y: 0.75, isBlocked: emergency.blockedExits.includes("Exit 3") }
      ];

      exits.forEach(ex => {
        const eX = ex.x * width;
        const eY = ex.y * height;

        ctx.fillStyle = ex.isBlocked ? '#EF4444' : '#10B981';
        ctx.beginPath();
        ctx.arc(eX, eY, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ex.isBlocked ? "BLOCKED" : ex.name, eX, eY + 4);
        ctx.textAlign = 'left';
      });

      // Evacuation Arrows Flow Overlay (if Emergency active or toggle enabled)
      if (emergency.active && showEvacuationOverlay) {
        // Draw directional glowing arrows pointing to safe exit 1 & 3
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 8]);
        ctx.lineDashOffset = -arrowOffset;

        // Route from Assembly Line to Exit 1
        ctx.beginPath();
        ctx.moveTo(0.50 * width, 0.25 * height);
        ctx.lineTo(0.04 * width, 0.25 * height);
        ctx.stroke();

        // Route from Warehouse to Exit 3
        ctx.beginPath();
        ctx.moveTo(0.80 * width, 0.75 * height);
        ctx.lineTo(0.96 * width, 0.75 * height);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(renderMap);
    };

    renderMap();
    return () => cancelAnimationFrame(animId);
  }, [emergency, showEvacuationOverlay]);

  return (
    <div className="space-y-4 select-none">
      {/* Top Map Header Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              INTERACTIVE FACTORY FLOOR MAP (2D LIVE TELEMETRY)
            </h2>
            <p className="text-xs text-slate-400 font-mono">Real-time machine health nodes & animated personnel tracking</p>
          </div>
        </div>

        {/* Status Colors Legend & Controls */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-green" /> Healthy
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-glow-orange" /> Warning
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-red animate-ping" /> Critical
            </span>
          </div>

          <button
            onClick={() => setShowEvacuationOverlay(!showEvacuationOverlay)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
              showEvacuationOverlay
                ? 'bg-cyan-950 border-cyan-500/40 text-cyan-400 shadow-glow-cyan'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Evacuation Overlay</span>
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas & Interactive DOM Overlay */}
      <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-cyan-950 shadow-2xl bg-[#060B12]">
        {/* HTML5 Background Canvas */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={650}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Machine Nodes Overlay (Clickable) */}
        {machines.map((m) => {
          const statusBg =
            m.status === 'Critical' ? 'bg-red-500 border-red-300 shadow-glow-red animate-pulse' :
            m.status === 'Warning' ? 'bg-amber-400 border-amber-200 shadow-glow-orange' :
            'bg-emerald-400 border-emerald-200 shadow-glow-green';

          return (
            <div
              key={m.id}
              onClick={() => {
                setActiveMachineDetail(m);
                setSelectedMachineId(m.id);
              }}
              style={{ left: `${m.xRatio * 100}%`, top: `${m.yRatio * 100}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              {/* Machine Icon & Glow Ring */}
              <div className={`w-9 h-9 rounded-xl border-2 ${statusBg} flex items-center justify-center text-black font-bold text-xs font-mono transition-transform group-hover:scale-125`}>
                {m.id}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 p-2.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-xs shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 font-mono">
                <div className="font-bold text-white text-[11px] truncate">{m.name}</div>
                <div className="text-[10px] text-slate-400">Health: <span className="text-cyan-400 font-bold">{m.health}%</span></div>
                <div className="text-[10px] text-slate-400">Temp: <span className="text-amber-400 font-bold">{m.temperature}°C</span></div>
                {m.issues.length > 0 && (
                  <div className="text-[9px] text-red-400 font-semibold truncate pt-1 border-t border-slate-800 mt-1">
                    ⚠️ {m.issues[0]}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Worker Moving Dot Icons */}
        {workers.map((w) => (
          <div
            key={w.id}
            style={{ left: `${w.xRatio * 100}%`, top: `${w.yRatio * 100}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ease-linear pointer-events-none group"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-6 h-6 rounded-full bg-cyan-500/20 animate-ping" />
              <img
                src={w.avatar}
                alt={w.name}
                className="w-6 h-6 rounded-full border border-cyan-400 object-cover shadow-glow-cyan"
              />
              <span className="absolute -bottom-4 text-[9px] font-mono bg-black/80 text-cyan-300 px-1 rounded truncate max-w-[70px]">
                {w.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal when Machine Clicked */}
      <MachineDetailModal
        machine={activeMachineDetail}
        onClose={() => setActiveMachineDetail(null)}
      />
    </div>
  );
};

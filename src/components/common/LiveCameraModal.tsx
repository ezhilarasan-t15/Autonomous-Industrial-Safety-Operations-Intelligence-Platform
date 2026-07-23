import React, { useEffect, useRef } from 'react';
import { X, Camera, Eye, Cpu, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Machine } from '../../types/factory';

interface LiveCameraModalProps {
  machine: Machine | null;
  onClose: () => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({ machine, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!machine || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let t = 0;

    const renderFeed = () => {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark industrial floor background
      ctx.fillStyle = '#080C14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Industrial grid lines
      ctx.strokeStyle = '#10192A';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Machine Frame Representation
      const mX = canvas.width / 2 - 120;
      const mY = canvas.height / 2 - 80;
      ctx.fillStyle = '#162032';
      ctx.fillRect(mX, mY, 240, 160);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(mX, mY, 240, 160);

      // Draw Rotating Machine Parts / Turbine
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(t);
      ctx.strokeStyle = machine.status === 'Critical' ? '#EF4444' : '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.lineTo(45, 0);
      ctx.moveTo(0, -45);
      ctx.lineTo(0, 45);
      ctx.stroke();
      ctx.restore();

      // AI Bounding Box 1: Machine Detection
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(mX - 10, mY - 10, 260, 180);
      ctx.setLineDash([]);

      // Bounding box badge label
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(mX - 10, mY - 32, 180, 22);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText(`AI TARGET: ${machine.id} (99.4%)`, mX - 4, mY - 17);

      // AI Bounding Box 2: Fault Detection (if Warning/Critical)
      if (machine.status === 'Critical' || machine.status === 'Warning') {
        const faultX = mX + 130 + Math.sin(t * 2) * 10;
        const faultY = mY + 30;

        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(faultX, faultY, 80, 70);

        ctx.fillStyle = '#EF4444';
        ctx.fillRect(faultX, faultY - 20, 110, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px monospace';
        ctx.fillText("LOOSE SCREW 88%", faultX + 4, faultY - 7);
      }

      // Simulated Thermal Heatmap Overlay
      const grad = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(t) * 15,
        canvas.height / 2,
        5,
        canvas.width / 2,
        canvas.height / 2,
        80
      );
      grad.addColorStop(0, machine.temperature > 80 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 85, 0, Math.PI * 2);
      ctx.fill();

      // Camera Crosshair & HUD Overlay
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animFrameId = requestAnimationFrame(renderFeed);
    };

    renderFeed();

    return () => cancelAnimationFrame(animFrameId);
  }, [machine]);

  if (!machine) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B101A] border border-cyan-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl shadow-cyan-950/50 space-y-0">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">LIVE AI CAMERA FEED — {machine.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  REC • 60 FPS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{machine.name} ({machine.zone})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-black flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-auto max-h-[420px] object-contain"
          />

          {/* AI Diagnostic Overlay Bar */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-cyan-400">
                <Eye className="w-3.5 h-3.5" />
                <span>AI Vision: Active</span>
              </div>
              <div className="text-slate-300">
                Temp Thermography: <span className={machine.temperature > 75 ? 'text-red-400 font-bold' : 'text-emerald-400'}>{machine.temperature}°C</span>
              </div>
              <div className="text-slate-300">
                PPE Check: <span className="text-emerald-400 font-bold">100% Compliant</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-slate-400">CAM-04-NORTH</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400 font-mono text-[11px]">
            Sensor Telemetry ID: <span className="text-slate-200">CAM-AI-{machine.id}-09</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono transition-all"
          >
            CLOSE CAMERA VIEW
          </button>
        </div>
      </div>
    </div>
  );
};

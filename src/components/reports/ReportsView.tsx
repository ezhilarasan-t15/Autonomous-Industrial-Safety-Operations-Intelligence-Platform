import React, { useState } from 'react';
import { FileText, Download, Printer, CheckCircle2, ShieldAlert, Zap, Users, Activity, Calendar } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

type ReportType =
  | 'Daily Report'
  | 'Weekly Report'
  | 'Monthly Report'
  | 'Machine Telemetry Report'
  | 'Worker Performance & PPE'
  | 'Safety & Emergency Log'
  | 'Power & Generator Audit';

export const ReportsView: React.FC = () => {
  const { machines, workers, power, emergency, quality } = useFactory();
  const [selectedReport, setSelectedReport] = useState<ReportType>('Daily Report');

  const reportTypes: { name: ReportType; icon: React.ReactNode; desc: string }[] = [
    { name: 'Daily Report', icon: <Calendar className="w-5 h-5 text-cyan-400" />, desc: '24-hour executive summary of shift metrics, production & incidents.' },
    { name: 'Weekly Report', icon: <FileText className="w-5 h-5 text-blue-400" />, desc: 'Weekly machine OEE, maintenance hours & throughput.' },
    { name: 'Monthly Report', icon: <FileText className="w-5 h-5 text-purple-400" />, desc: '30-day compliance, energy consumption & ROI audits.' },
    { name: 'Machine Telemetry Report', icon: <Activity className="w-5 h-5 text-amber-400" />, desc: 'Diagnostic logs for M01-M12, vibration & thermal degradation.' },
    { name: 'Worker Performance & PPE', icon: <Users className="w-5 h-5 text-emerald-400" />, desc: 'Technician task completions, AI PPE compliance checks.' },
    { name: 'Safety & Emergency Log', icon: <ShieldAlert className="w-5 h-5 text-red-400" />, desc: 'Hazard alarms, evacuation drills, exit clearing events.' },
    { name: 'Power & Generator Audit', icon: <Zap className="w-5 h-5 text-amber-400" />, desc: 'Diesel fuel reserves, UPS battery health & power load.' },
  ];

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-6 select-none print:bg-white print:text-black">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              ENTERPRISE AUDIT & REPORT GENERATOR
            </h1>
            <p className="text-xs text-slate-400 font-mono">Formal Automated Operational Reports & Downloadable PDF Audits</p>
          </div>
        </div>

        <button
          onClick={handlePrintDownload}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono text-xs shadow-glow-cyan transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD PDF / PRINT REPORT</span>
        </button>
      </div>

      {/* Report Selection Tabs (Hidden during print) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 print:hidden">
        {reportTypes.map((rep) => (
          <button
            key={rep.name}
            onClick={() => setSelectedReport(rep.name)}
            className={`p-3 rounded-2xl border text-left space-y-2 transition-all ${
              selectedReport === rep.name
                ? 'bg-gradient-to-br from-cyan-950 to-blue-950 border-cyan-500 shadow-glow-cyan'
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
            }`}
          >
            {rep.icon}
            <div className="text-xs font-bold text-white leading-snug">{rep.name}</div>
          </button>
        ))}
      </div>

      {/* Printable Report Formatted Sheet */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 print:border-none print:shadow-none">
        {/* Formal Document Title */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              SAFEVISION AI • ENTERPRISE AUDIT DOCUMENT
            </div>
            <h2 className="text-2xl font-extrabold text-white font-mono mt-1 uppercase">
              {selectedReport}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Generated on: {new Date().toLocaleDateString()} • Classified: Internal Command Use Only
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 hidden sm:block">
            <div>Factory: Gigafactory Alpha-1</div>
            <div>Location: Zone 09 Control Room</div>
            <div className="text-emerald-400 font-bold">Status: VERIFIED</div>
          </div>
        </div>

        {/* Section 1: Executive KPI Metrics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
            1. Key Performance Indicators Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Overall Health Score</span>
              <span className="text-xl font-bold text-emerald-400">96.4%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Active Machinery</span>
              <span className="text-xl font-bold text-white">{machines.length} / {machines.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">On-Duty Personnel</span>
              <span className="text-xl font-bold text-cyan-400">{workers.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Quality Batch Score</span>
              <span className="text-xl font-bold text-emerald-400">{quality.qualityScore}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Detailed Data Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
            2. Machinery Health Audit Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Machine ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Health Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Active Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-bold text-cyan-400">{m.id}</td>
                    <td className="py-2.5 px-3 text-slate-200">{m.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{m.zone}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{m.health}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                        m.status === 'Critical' ? 'bg-red-950 text-red-400 border-red-500/50' :
                        m.status === 'Warning' ? 'bg-amber-950 text-amber-400 border-amber-500/50' : 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {m.issues.length > 0 ? m.issues.join(', ') : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Signoff */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <div>Approved By: <span className="text-white font-bold">Cmdr. Marcus Vance (Chief Operations Officer)</span></div>
          <div>Cryptographic Signature: <span className="text-cyan-400">0x89F4...A019</span></div>
        </div>
      </div>
    </div>
  );
};

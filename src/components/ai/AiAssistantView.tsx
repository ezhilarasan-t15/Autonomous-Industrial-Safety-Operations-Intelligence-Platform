import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const AiAssistantView: React.FC = () => {
  const { chatMessages, sendChatMessage } = useFactory();
  const [inputMsg, setInputMsg] = useState<string>('');

  const quickPrompts = [
    "Which machines need maintenance?",
    "Why production stopped?",
    "Show fuel status.",
    "Show emergency report.",
    "Show worker efficiency.",
    "Summarize today's factory status."
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(inputMsg);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              SAFEVISION NEURAL AI ASSISTANT & COMMAND COPILOT
            </h1>
            <p className="text-xs text-slate-400 font-mono">Autonomous Factory Intelligence Engine • Natural Language Telemetry Queries</p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface Window */}
      <div className="glass-panel rounded-2xl border border-slate-800 h-[600px] flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Messages Feed */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none font-sans font-semibold text-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none leading-relaxed'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-1 font-bold">
                  <span>{msg.sender === 'user' ? 'COMMANDER VANCE' : 'SAFEVISION AI ENGINE'}</span>
                  <span className="text-slate-500 font-normal">{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts Panel */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Quick Diagnostics:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendChatMessage(prompt)}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your prompt (e.g., 'Show fuel status', 'Which machines need repair?')..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono text-xs transition-all flex items-center gap-2"
          >
            <span>SEND QUERY</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

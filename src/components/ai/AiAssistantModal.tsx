import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, ChevronRight } from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export const AiAssistantModal: React.FC = () => {
  const { chatMessages, sendChatMessage } = useFactory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMsg, setInputMsg] = useState<string>('');

  const quickPrompts = [
    "Which machines need maintenance?",
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
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold shadow-2xl shadow-cyan-500/40 hover:scale-105 transition-all flex items-center gap-2 border border-cyan-300"
        >
          <Bot className="w-6 h-6 animate-pulse text-black" />
          <span className="text-xs font-mono font-extrabold uppercase hidden sm:inline">Ask SafeVision AI</span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-[#0B101A]/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  SafeVision AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[9px] font-mono text-cyan-400">Neural Operations Copilot</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="p-3 space-y-3 overflow-y-auto flex-1 font-sans text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none font-mono leading-relaxed'
                }`}>
                  <p className="text-xs">{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1 opacity-70">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendChatMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 shrink-0 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Copilot..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

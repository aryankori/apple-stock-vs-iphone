import React, { useState, useRef, useEffect } from 'react';
import { IPhoneCalculation } from '../types';
import { Terminal, Send, ChevronRight } from 'lucide-react';

interface TerminalPromptProps {
  models: IPhoneCalculation[];
  onSelectModel: (model: IPhoneCalculation) => void;
  onRefreshStock: () => void;
  onOpenGuide: () => void;
  onToggleCrt: () => void;
  crtEnabled: boolean;
  theme: 'green' | 'amber';
  onToggleTheme: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  models,
  onSelectModel,
  onRefreshStock,
  onOpenGuide,
  onToggleCrt,
  crtEnabled,
  theme,
  onToggleTheme,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init --mode=aapl-mainframe',
      output: (
        <div className="space-y-1">
          <p className="text-[#33ff00] font-bold terminal-glow">AAPL MAINFRAME OS [VERSION 2026.09.02-PROD]</p>
          <p className="text-slate-400 text-xs">Ready. Type <span className="text-white font-bold underline">help</span> or <span className="text-white font-bold underline">list</span> to view commands.</p>
        </div>
      ),
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const commandHistory = useRef<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.current.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.current.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory.current[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.current.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory.current[nextIndex] || '');
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = input.trim();
    if (!rawCmd) return;

    commandHistory.current.push(rawCmd);
    setHistoryIndex(-1);
    setInput('');

    const args = rawCmd.split(' ').filter(Boolean);
    const cmd = args[0].toLowerCase();
    const logId = Date.now().toString();

    switch (cmd) {
      case 'help':
      case '?':
      case 'man':
        setHistory(prev => [
          ...prev,
          {
            id: logId,
            command: rawCmd,
            output: (
              <div className="text-xs space-y-1.5 text-slate-300 font-mono">
                <p className="text-yellow-400 font-bold">AVAILABLE COMMANDS:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  <div><span className="text-[#33ff00] font-bold">simulate &lt;id&gt; [price]</span>: Sim model #ID</div>
                  <div><span className="text-[#33ff00] font-bold">list / ls</span>: List 49 iPhone models</div>
                  <div><span className="text-[#33ff00] font-bold">refresh</span>: Fetch live AAPL stock</div>
                  <div><span className="text-[#33ff00] font-bold">cat docs</span>: Open STE technical manual</div>
                  <div><span className="text-[#33ff00] font-bold">crt</span>: Toggle CRT scanline overlay</div>
                  <div><span className="text-[#33ff00] font-bold">theme</span>: Switch Green / Amber mode</div>
                  <div><span className="text-[#33ff00] font-bold">clear / cls</span>: Clear shell output</div>
                </div>
              </div>
            )
          }
        ]);
        break;

      case 'list':
      case 'ls':
        setHistory(prev => [
          ...prev,
          {
            id: logId,
            command: rawCmd,
            output: (
              <div className="text-xs space-y-1 max-h-48 overflow-y-auto pr-2">
                <p className="text-yellow-400 font-bold">AVAILABLE IPHONE MODELS (1-49):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[11px]">
                  {models.map(m => (
                    <div key={m.id} className="text-slate-300">
                      <span className="text-[#33ff00] font-bold">[{m.id}]</span> {m.model} (${m.modelPrice})
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        ]);
        break;

      case 'simulate':
      case 'sim': {
        const targetId = args[1];
        if (!targetId) {
          setHistory(prev => [
            ...prev,
            { id: logId, command: rawCmd, isError: true, output: 'ERR: Missing model ID. Usage: simulate <1-49>' }
          ]);
          return;
        }

        const found = models.find(m => m.id === targetId || m.model.toLowerCase().includes(targetId.toLowerCase()));
        if (found) {
          onSelectModel(found);
          setHistory(prev => [
            ...prev,
            {
              id: logId,
              command: rawCmd,
              output: (
                <span className="text-[#33ff00]">
                  [OK] Selected model: <strong>{found.model}</strong> (MSRP: ${found.modelPrice}, Launch AAPL: ${found.historicalStockPrice.toFixed(2)}, ROI: +{(found.roi * 100).toFixed(2)}%)
                </span>
              )
            }
          ]);
        } else {
          setHistory(prev => [
            ...prev,
            { id: logId, command: rawCmd, isError: true, output: `ERR: Model '${targetId}' not found. Run 'list' for IDs.` }
          ]);
        }
        break;
      }

      case 'refresh':
        onRefreshStock();
        setHistory(prev => [
          ...prev,
          { id: logId, command: rawCmd, output: '[RUN] Triggering real-time AAPL market quote polling...' }
        ]);
        break;

      case 'cat':
      case 'docs':
      case 'manual':
        onOpenGuide();
        setHistory(prev => [
          ...prev,
          { id: logId, command: rawCmd, output: '[OK] Opened ASD-STE100 technical documentation manual.' }
        ]);
        break;

      case 'crt':
      case 'scanlines':
        onToggleCrt();
        setHistory(prev => [
          ...prev,
          { id: logId, command: rawCmd, output: `[OK] CRT scanlines: ${!crtEnabled ? 'ENABLED' : 'DISABLED'}` }
        ]);
        break;

      case 'theme':
      case 'color':
        onToggleTheme();
        setHistory(prev => [
          ...prev,
          { id: logId, command: rawCmd, output: `[OK] Terminal theme switched to ${theme === 'green' ? 'AMBER' : 'PHOSPHOR GREEN'}` }
        ]);
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        break;

      default:
        setHistory(prev => [
          ...prev,
          {
            id: logId,
            command: rawCmd,
            isError: true,
            output: `zsh: command not found: ${cmd}. Type 'help' for available system commands.`
          }
        ]);
    }
  };

  return (
    <div className="terminal-box border border-[#1f521f] bg-[#0c0c0c]">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#121212] border-b border-[#1f521f] text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#33ff00]" />
          <span className="font-bold text-[#33ff00] uppercase tracking-wider">
            +-- INTERACTIVE SHELL PROMPT // zsh --+
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">guest@apple-mainframe:~</span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1f521f]/50 text-[#33ff00]">
            [CLI:READY]
          </span>
        </div>
      </div>

      {/* Terminal Output Log Area */}
      <div
        ref={scrollRef}
        className="p-3.5 max-h-44 overflow-y-auto space-y-2 font-mono text-xs text-slate-300 border-b border-[#1f521f]/50"
      >
        {history.map((item) => (
          <div key={item.id} className="space-y-0.5">
            <div className="flex items-center gap-1 text-[#33ff00]/80">
              <span className="text-slate-500">guest@mainframe:~$</span>
              <span className="font-semibold text-white">{item.command}</span>
            </div>
            <div className={`pl-4 ${item.isError ? 'text-red-400' : 'text-slate-300'}`}>
              {item.output}
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Command Input Form */}
      <form onSubmit={handleCommand} className="flex items-center px-3 py-2 bg-[#090909]">
        <div className="flex items-center gap-1 text-[#33ff00] text-xs font-bold mr-2 select-none">
          <ChevronRight className="w-3.5 h-3.5" />
          <span>aapl$</span>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help', 'simulate 1', 'list', 'refresh', 'crt'..."
          className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="px-2.5 py-1 text-[11px] font-bold uppercase bg-[#1f521f]/40 hover:bg-[#33ff00] hover:text-black text-[#33ff00] border border-[#1f521f] transition flex items-center gap-1"
        >
          <span>EXEC</span>
          <Send className="w-2.5 h-2.5" />
        </button>
      </form>
    </div>
  );
};

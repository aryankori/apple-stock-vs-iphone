import React from 'react';

interface TerminalPaneProps {
  title: string;
  subtitle?: string;
  status?: string;
  theme?: 'green' | 'amber';
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  headerPrefix?: string;
}

export const TerminalPane: React.FC<TerminalPaneProps> = ({
  title,
  subtitle,
  status = 'SYS:OK',
  theme = 'green',
  children,
  actions,
  className = '',
  headerPrefix = 'PANE',
}) => {
  const isGreen = theme === 'green';
  const borderColor = isGreen ? 'border-[#1f521f]' : 'border-[#593c00]';
  const headerBg = isGreen ? 'bg-[#0f1a0f]' : 'bg-[#1a1400]';
  const titleColor = isGreen ? 'text-[#33ff00] terminal-glow' : 'text-[#ffb000] amber-glow';
  const statusColor = isGreen ? 'text-[#33ff00] bg-[#1f521f]/40' : 'text-[#ffb000] bg-[#593c00]/40';

  return (
    <div className={`terminal-box ${isGreen ? '' : 'terminal-box-amber'} border ${borderColor} ${className}`}>
      {/* Terminal Title Bar */}
      <div className={`flex flex-wrap items-center justify-between px-3 py-1.5 ${headerBg} border-b ${borderColor} text-xs`}>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-bold">[{headerPrefix}]</span>
          <span className={`font-bold uppercase tracking-wider ${titleColor}`}>
            +-- {title} --+
          </span>
          {subtitle && (
            <span className="text-slate-400 text-[11px] hidden sm:inline font-mono">
              // {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          {actions}
          <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase font-mono ${statusColor}`}>
            [{status}]
          </span>
        </div>
      </div>

      {/* Pane Content */}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};

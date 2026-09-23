import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useReveal } from '../lib/hooks';

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
}

/** An accessible segmented control built on a radio group. */
export function Segmented<T extends string>({ label, value, options, onChange, size = 'md' }: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-full bg-surface-2 p-1 ring-1 ring-inset ring-line"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            'rounded-full font-medium transition-all',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
            value === o.value ? 'bg-surface text-ink shadow-sm ring-1 ring-line' : 'text-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  id: string;
}

export function Switch({ checked, onChange, label, id }: SwitchProps) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-ink-2">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-6 w-10 shrink-0 rounded-full transition-colors',
          checked ? 'bg-good' : 'bg-hairline ring-1 ring-inset ring-line',
        )}
      >
        <span
          className={clsx(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </button>
      {label}
    </label>
  );
}

interface SectionProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, title, lede, children, className }: SectionProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={clsx('py-16 sm:py-24', className)}>
      <div ref={ref} className="reveal mx-auto max-w-page px-4 sm:px-6">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`} className="section-title mt-2">
          {title}
        </h2>
        {lede && <p className="section-lede">{lede}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

interface StatProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: 'default' | 'good' | 'bad';
}

export function Stat({ label, value, detail, tone = 'default' }: StatProps) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-muted">{label}</p>
      <p
        className={clsx(
          'mt-1 truncate text-2xl font-semibold tracking-tight sm:text-[28px]',
          tone === 'good' && 'text-good',
          tone === 'bad' && 'text-bad',
          tone === 'default' && 'text-ink',
        )}
      >
        {value}
      </p>
      {detail && <p className="mt-0.5 text-sm text-ink-2">{detail}</p>}
    </div>
  );
}

/** A short coloured stroke that keys a series in legends and tooltips. */
export function LineKey({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <svg width="16" height="8" aria-hidden="true" className="shrink-0">
      <line
        x1="1"
        y1="4"
        x2="15"
        y2="4"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={dashed ? '3 3' : undefined}
      />
    </svg>
  );
}

export function DotKey({ color }: { color: string }) {
  return (
    <svg width="12" height="12" aria-hidden="true" className="shrink-0">
      <circle cx="6" cy="6" r="4.5" fill={color} stroke="var(--surface)" strokeWidth="1.5" />
    </svg>
  );
}

export function Legend({ items }: { items: { key: ReactNode; label: ReactNode }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-2">
      {items.map((item, i) => (
        <li key={i} className="inline-flex items-center gap-1.5">
          {item.key}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

interface TooltipProps {
  x: number;
  y: number;
  width: number;
  children: ReactNode;
}

/** Tooltip card positioned inside a relative chart container; flips to stay in bounds. */
export function ChartTooltip({ x, y, width, children }: TooltipProps) {
  const flip = x > width * 0.6;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-[150px] max-w-[240px] rounded-xl bg-surface px-3 py-2 text-sm shadow-lg ring-1 ring-line"
      style={{
        left: flip ? undefined : x + 14,
        right: flip ? width - x + 14 : undefined,
        top: Math.max(0, y),
      }}
    >
      {children}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  BrainCircuit,
  Bus,
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  Download,
  FileImage,
  Film,
  Home,
  Inbox,
  Lightbulb,
  LoaderCircle,
  Lock,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Plus,
  ReceiptText,
  Repeat,
  ScanLine,
  Send,
  Sparkles,
  Tag,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserRound,
  Utensils,
  Wallet,
  WalletCards,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import api from '../services/api.js';
import { useEntrance } from '../hooks/useEntrance.js';
import { useAuth } from '../context/AuthContext.jsx';
import { confirmDialog, notifyError, notifySuccess } from '../utils/swal.js';
import { Modal } from '../components/common/Modal.jsx';

const money = x =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(x || 0));

const monthNow = () => new Date().toISOString().slice(0, 7);

const dateLabel = x =>
  new Date(x).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const CATEGORY_COLORS = [
  { hex: '#f59e0b', grad: ['#fcd34d', '#d97706'], soft: 'rgba(245,158,11,0.18)' },
  { hex: '#8b5cf6', grad: ['#c4b5fd', '#6d28d9'], soft: 'rgba(139,92,246,0.18)' },
  { hex: '#06b6d4', grad: ['#67e8f9', '#0e7490'], soft: 'rgba(6,182,212,0.18)' },
  { hex: '#ec4899', grad: ['#f9a8d4', '#be185d'], soft: 'rgba(236,72,153,0.18)' },
  { hex: '#10b981', grad: ['#6ee7b7', '#047857'], soft: 'rgba(16,185,129,0.18)' },
  { hex: '#f97316', grad: ['#fdba74', '#c2410c'], soft: 'rgba(249,115,22,0.18)' },
  { hex: '#6366f1', grad: ['#a5b4fc', '#4338ca'], soft: 'rgba(99,102,241,0.18)' },
  { hex: '#14b8a6', grad: ['#5eead4', '#0f766e'], soft: 'rgba(20,184,166,0.18)' },
  { hex: '#a855f7', grad: ['#d8b4fe', '#7e22ce'], soft: 'rgba(168,85,247,0.18)' },
  { hex: '#f43f5e', grad: ['#fda4af', '#be123c'], soft: 'rgba(244,63,94,0.18)' },
];

const CATEGORY_ICON_MAP = {
  Food: Utensils,
  Transport: Bus,
  'Hostel/Rent': Home,
  Academics: BookOpen,
  Subscriptions: Repeat,
  Entertainment: Film,
  Miscellaneous: MoreHorizontal,
  Allowance: Wallet,
  Salary: Wallet,
};

function CategoryIcon({ name, size = 16, className = '' }) {
  const Icon = CATEGORY_ICON_MAP[name] || Tag;
  return <Icon size={size} className={className} />;
}

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function FinanceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/15 bg-slate-950/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
      {label !== undefined && label !== '' ? (
        <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-300">
          {label}
        </p>
      ) : null}
      {payload.map(item => (
        <div key={item.dataKey || item.name} className="flex items-center gap-2.5 text-[12.5px]">
          <span
            className="h-2.5 w-2.5 rounded-full ring-2 ring-white/10"
            style={{ background: item.color || item.payload?.fill || item.fill || '#22d3ee' }}
          />
          <span className="text-slate-400">{item.name || item.dataKey}</span>
          <span className="ml-auto font-bold text-white">{money(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

const CARD_BASE =
  'relative rounded-2xl border shadow-xl backdrop-blur-sm transition-all duration-300 ease-out';

const CARD_TONES = {
  default:
    'border-white/[0.08] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-slate-950/60 hover:border-white/[0.15] hover:shadow-slate-950/80',
  cyan:
    'border-cyan-400/20 bg-gradient-to-br from-[#07192b] via-[#050f1d] to-[#07192b] shadow-cyan-950/50 hover:border-cyan-400/40 hover:shadow-cyan-900/40',
  blue:
    'border-blue-400/20 bg-gradient-to-br from-[#08162c] via-[#050d1e] to-[#08162c] shadow-blue-950/50 hover:border-blue-400/40 hover:shadow-blue-900/40',
  emerald:
    'border-emerald-400/20 bg-gradient-to-br from-[#051a18] via-[#03100e] to-[#051a18] shadow-emerald-950/50 hover:border-emerald-400/40 hover:shadow-emerald-900/40',
  amber:
    'border-amber-400/20 bg-gradient-to-br from-[#1b1206] via-[#120b04] to-[#1b1206] shadow-amber-950/50 hover:border-amber-400/40 hover:shadow-amber-900/40',
  rose:
    'border-rose-400/20 bg-gradient-to-br from-[#1b0810] via-[#120509] to-[#1b0810] shadow-rose-950/50 hover:border-rose-400/40 hover:shadow-rose-900/40',
  violet:
    'border-violet-400/20 bg-gradient-to-br from-[#140a22] via-[#0c0517] to-[#140a22] shadow-violet-950/50 hover:border-violet-400/40 hover:shadow-violet-900/40',
  indigo:
    'border-indigo-400/20 bg-gradient-to-br from-[#0a0f22] via-[#060916] to-[#0a0f22] shadow-indigo-950/50 hover:border-indigo-400/40 hover:shadow-indigo-900/40',
  fuchsia:
    'border-fuchsia-400/20 bg-gradient-to-br from-[#1a0a20] via-[#110616] to-[#1a0a20] shadow-fuchsia-950/50 hover:border-fuchsia-400/40 hover:shadow-fuchsia-900/40',
  teal:
    'border-teal-400/20 bg-gradient-to-br from-[#04191c] via-[#031012] to-[#04191c] shadow-teal-950/50 hover:border-teal-400/40 hover:shadow-teal-900/40',
};

const CARD_PAD = 'p-5 sm:p-6';
const HEADING = 'text-[15px] font-bold tracking-tight text-white';
const SUB = 'text-[12px] leading-relaxed text-slate-400';
const EYEBROW = 'text-[10.5px] font-bold uppercase tracking-[0.28em] text-cyan-300';

function PageTitle({ eyebrow = 'Your money, clearly', title, description, children }) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? <p className={EYEBROW}>{eyebrow}</p> : null}
        <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-slate-400 bg-clip-text text-[1.7rem] font-bold leading-tight tracking-[-0.025em] text-transparent sm:text-[2rem] lg:text-[2.15rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-[13.5px] leading-relaxed text-slate-400">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">{children}</div>
      ) : null}
    </header>
  );
}

function Card({
  children,
  className = '',
  padded = true,
  as: Tag = 'article',
  tone = 'default',
  glow = false,
}) {
  const toneCls = CARD_TONES[tone] || CARD_TONES.default;
  return (
    <Tag className={`${CARD_BASE} ${toneCls} ${padded ? CARD_PAD : ''} ${className}`}>
      {glow ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/[0.06] blur-3xl" />
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

function CardHead({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <h2 className={HEADING}>{title}</h2>
        {subtitle ? <p className={`mt-1 ${SUB}`}>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function Btn({ variant = 'primary', children, className = '', as: Tag = 'button', icon, ...rest }) {
  const base = `inline-flex items-center rounded-full ${icon ? 'pr-4 pl-1' : 'px-4'} py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[12px] uppercase tracking-wider text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;
  const variants = {
    primary: { bg: 'bg-[#2b7cb6]', text: 'text-[#2b7cb6]' },
    secondary: { bg: 'bg-[#5c6b7a]', text: 'text-[#5c6b7a]' },
    ghost: { bg: 'bg-transparent border border-white/20 hover:bg-white/10 text-slate-300', text: 'text-slate-300' },
    danger: { bg: 'bg-[#ef4444]', text: 'text-[#ef4444]' },
    outlineDanger: { bg: 'bg-transparent border border-[#ef4444] hover:bg-[#ef4444]/10', text: 'text-[#ef4444]' },
    success: { bg: 'bg-[#7ac142]', text: 'text-[#7ac142]' },
    warning: { bg: 'bg-[#f5a623]', text: 'text-[#f5a623]' },
    violet: { bg: 'bg-[#7a3b9c]', text: 'text-[#7a3b9c]' },
    fuchsia: { bg: 'bg-[#e81263]', text: 'text-[#e81263]' },
    teal: { bg: 'bg-[#00a884]', text: 'text-[#00a884]' },
  };
  const v = variants[variant] || variants.primary;

  return (
    <Tag className={`${base} ${v.bg} ${className}`} {...rest}>
      {icon && (
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white mr-3 ${v.text}`}>
          {icon}
        </div>
      )}
      <span className="flex-grow text-center">{children}</span>
    </Tag>
  );
}

function Field({ as = 'input', className = '', invalid, children, ...rest }) {
  const base =
    'w-full rounded-xl border bg-slate-950/70 px-4 py-2.5 text-[13.5px] text-slate-100 placeholder-slate-500 outline-none transition-all duration-300 focus:bg-slate-950/90 focus:ring-4 disabled:opacity-50';
  const border = invalid
    ? 'border-rose-500/60 focus:border-rose-400 focus:ring-rose-500/20'
    : 'border-white/[0.1] focus:border-cyan-400/70 focus:ring-cyan-400/15';
  if (as === 'select') {
    return (
      <select className={`${base} ${border} pr-9 ${className}`} {...rest}>
        {children}
      </select>
    );
  }
  if (as === 'textarea') {
    return (
      <textarea className={`${base} ${border} min-h-[100px] resize-y ${className}`} {...rest} />
    );
  }
  return <input className={`${base} ${border} ${className}`} {...rest} />;
}

function FieldGroup({ label, htmlFor, error, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-rose-400">
          <AlertCircle size={12} /> {error}
        </p>
      ) : null}
    </div>
  );
}

function FormGrid({ children, className = '' }) {
  return <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>{children}</div>;
}

function Metric({ label, value, detail, tone = 'cyan', icon, trend }) {
  const tones = {
    cyan: {
      card: 'cyan',
      chip: 'text-cyan-100 border-cyan-300/50 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 shadow-lg shadow-cyan-500/30',
      accent: 'from-cyan-400 to-blue-500',
    },
    emerald: {
      card: 'emerald',
      chip: 'text-emerald-100 border-emerald-300/50 bg-gradient-to-br from-emerald-400/30 to-teal-500/20 shadow-lg shadow-emerald-500/30',
      accent: 'from-emerald-400 to-teal-500',
    },
    amber: {
      card: 'amber',
      chip: 'text-amber-100 border-amber-300/50 bg-gradient-to-br from-amber-400/30 to-orange-500/20 shadow-lg shadow-amber-500/30',
      accent: 'from-amber-400 to-orange-500',
    },
    violet: {
      card: 'violet',
      chip: 'text-violet-100 border-violet-300/50 bg-gradient-to-br from-violet-400/30 to-purple-500/20 shadow-lg shadow-violet-500/30',
      accent: 'from-violet-400 to-purple-500',
    },
    blue: {
      card: 'blue',
      chip: 'text-blue-100 border-blue-300/50 bg-gradient-to-br from-blue-400/30 to-indigo-500/20 shadow-lg shadow-blue-500/30',
      accent: 'from-blue-400 to-indigo-500',
    },
    rose: {
      card: 'rose',
      chip: 'text-rose-100 border-rose-300/50 bg-gradient-to-br from-rose-400/30 to-pink-500/20 shadow-lg shadow-rose-500/30',
      accent: 'from-rose-400 to-pink-500',
    },
  };
  const t = tones[tone] || tones.cyan;
  const TrendIcon = trend === 'negative' ? TrendingDown : TrendingUp;

  return (
    <Card
      tone={t.card}
      padded={false}
      className="group relative overflow-hidden p-5 hover:-translate-y-1"
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.accent} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${t.accent} opacity-70`}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${t.chip} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>
        {trend ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
              trend === 'negative'
                ? 'border-amber-400/50 bg-amber-500/20 text-amber-200'
                : 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
            }`}
          >
            <TrendIcon size={10} />
            {trend === 'negative' ? 'Up' : 'Good'}
          </span>
        ) : null}
      </div>
      <p className="relative mt-4 text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/60">
        {label}
      </p>
      <p className="relative mt-1 text-[22px] font-bold tracking-tight text-white">{value}</p>
      {detail ? <p className="relative mt-1.5 text-[11.5px] text-white/60">{detail}</p> : null}
    </Card>
  );
}

function Empty({ icon, title, description, action, compact }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-gradient-to-br from-white/[0.03] to-transparent text-center ${
        compact ? 'px-4 py-6' : 'px-6 py-14'
      }`}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-slate-300 shadow-lg shadow-black/30">
        {icon || <Inbox size={18} />}
      </div>
      <p className="text-[13px] font-bold text-white">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-[260px] text-[11.5px] leading-relaxed text-slate-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-500/20 via-rose-500/10 to-rose-500/[0.02] px-4 py-3.5 shadow-lg shadow-rose-950/40 backdrop-blur">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
      <p className="text-[12.5px] leading-relaxed text-rose-100">{error}</p>
    </div>
  );
}

function SuccessBox({ children }) {
  if (!children) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-emerald-500/[0.02] px-4 py-3.5 shadow-lg shadow-emerald-950/40 backdrop-blur">
      <CircleCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" />
      <div className="text-[12.5px] leading-relaxed text-emerald-100">{children}</div>
    </div>
  );
}

function SkeletonCard({ lines = 3 }) {
  return (
    <Card>
      <div className="mb-4 h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
      <div className="mb-2 h-3 w-1/3 animate-pulse rounded bg-white/[0.06]" />
      <div className="mb-4 h-6 w-2/3 animate-pulse rounded bg-white/[0.06]" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-2 h-3 w-full animate-pulse rounded bg-white/[0.05]" />
      ))}
    </Card>
  );
}

function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-white/[0.05]" />
          </div>
          <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
        </div>
      ))}
    </div>
  );
}

function DashboardBanner({ user, month, children }) {
  return (
    <Card padded={false} tone="blue" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className={EYEBROW}>Your money, clearly</p>
          <h1 className="mt-1.5 text-[1.35rem] font-bold leading-tight tracking-[-0.025em] text-white sm:text-[1.6rem]">
            Hello, {user?.name || 'Student'}
          </h1>
          <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-white/70">
            Here's your live picture for{' '}
            {new Date(`${month}-01`).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">{children}</div>
      </div>
    </Card>
  );
}

function BreakdownList({ data }) {
  const total = data.reduce((s, c) => s + Number(c.amount || 0), 0);
  const withColors = data.map((c, i) => ({
    ...c,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    pct: total ? (Number(c.amount) / total) * 100 : 0,
  }));

  return (
    <div className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[180px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 blur-3xl" />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {withColors.map((c, i) => (
                <linearGradient id={`donut-${i}`} key={i} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={c.color.grad[0]} />
                  <stop offset="100%" stopColor={c.color.grad[1]} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={withColors}
              dataKey="amount"
              nameKey="name"
              innerRadius="66%"
              outerRadius="100%"
              paddingAngle={3}
              cornerRadius={8}
              stroke="transparent"
              strokeWidth={2}
            >
              {withColors.map((_, i) => (
                <Cell key={i} fill={`url(#donut-${i})`} />
              ))}
            </Pie>
            <Tooltip content={<FinanceTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-white/60">
            Total
          </p>
          <p className="mt-0.5 text-[15px] font-bold tracking-tight text-white">
            {money(total)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {withColors.slice(0, 6).map((c, i) => (
          <div key={i} className="group flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-125"
              style={{
                background: `linear-gradient(135deg, ${c.color.grad[0]}, ${c.color.grad[1]})`,
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[12.5px] font-semibold text-white">{c.name}</p>
                <p className="shrink-0 text-[12px] font-bold text-white/90">
                  {money(c.amount)}
                </p>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${c.pct}%`,
                    background: `linear-gradient(90deg, ${c.color.grad[0]}, ${c.color.grad[1]})`,
                    boxShadow: `0 0 12px ${c.color.hex}80`,
                  }}
                />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-[11px] font-bold text-white/60">
              {c.pct.toFixed(0)}%
            </span>
          </div>
        ))}
        {withColors.length > 6 ? (
          <p className="pt-1 text-[11.5px] text-white/50">
            +{withColors.length - 6} more categories
          </p>
        ) : null}
      </div>
    </div>
  );
}

function BudgetBar({ name, spent, limit, warningPercentage, colorIndex = 0, onRemove }) {
  const pct = limit ? (spent / limit) * 100 : 0;
  const c = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length];
  const over = pct >= 100;
  const warn = !over && pct >= warningPercentage;

  const barStyle = over
    ? { background: 'linear-gradient(90deg,#fb7185,#e11d48)', boxShadow: '0 0 12px #e11d4880' }
    : warn
    ? { background: 'linear-gradient(90deg,#fbbf24,#d97706)', boxShadow: '0 0 12px #d9770680' }
    : {
        background: `linear-gradient(90deg, ${c.grad[0]}, ${c.grad[1]})`,
        boxShadow: `0 0 12px ${c.hex}80`,
      };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10"
            style={{ background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})` }}
          />
          <p className="truncate text-[13px] font-semibold text-white">{name}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p className="text-[11.5px] font-semibold text-white/80">
            {money(spent)} <span className="text-white/40">/</span> {money(limit)}
          </p>
          <span
            className={`rounded-full border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${
              over
                ? 'border-rose-400/50 bg-rose-500/25 text-rose-200 shadow-lg shadow-rose-500/20'
                : warn
                ? 'border-amber-400/50 bg-amber-500/25 text-amber-200 shadow-lg shadow-amber-500/20'
                : 'border-emerald-400/50 bg-emerald-500/25 text-emerald-200 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {over ? 'Over' : warn ? 'Warn' : 'OK'}
          </span>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, pct)}%`, ...barStyle }}
        />
      </div>
      <div className="flex items-center justify-between text-[11.5px] text-white/50">
        <span className="font-semibold">{Math.round(pct)}% used</span>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center rounded-full pr-2.5 pl-1 py-0.5 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[10px] uppercase tracking-wider text-white cursor-pointer bg-[#ef4444]"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white mr-1.5 text-[#ef4444]">
              <Trash2 size={10} />
            </div>
            <span className="flex-grow text-center pr-1">Remove</span>
          </button>
        ) : (
          <span className="font-semibold">
            {over
              ? `${money(spent - limit)} over`
              : `${money(Math.max(0, limit - spent))} left`}
          </span>
        )}
      </div>
    </div>
  );
}

function AnnouncementList({ items }) {
  if (!items.length) return null;
  const visible = items.slice(0, 3);
  return (
    <Card tone="amber" padded={false} className="overflow-hidden hover:-translate-y-1">
      <div className="flex items-center gap-3 border-b border-amber-400/15 bg-gradient-to-r from-amber-500/10 to-transparent px-5 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/50 bg-gradient-to-br from-amber-400/30 to-orange-500/20 text-amber-100 shadow-lg shadow-amber-500/30">
          <Megaphone size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-white">Announcements</p>
          <p className="text-[10.5px] text-white/60">
            {items.length} active {items.length === 1 ? 'notice' : 'notices'}
          </p>
        </div>
      </div>
      <ul className="divide-y divide-amber-400/10">
        {visible.map(a => (
          <li
            key={a._id}
            className="flex items-start gap-2.5 px-5 py-2.5 transition-colors hover:bg-white/[0.03]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow shadow-amber-400/60" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">
                {a.title || 'Untitled announcement'}
              </p>
              {a.message || a.body ? (
                <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-white/60">
                  {a.message || a.body}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {items.length > 3 ? (
        <div className="border-t border-amber-400/10 px-5 py-2 text-center">
          <p className="text-[10.5px] font-semibold text-amber-200/80">+{items.length - 3} more</p>
        </div>
      ) : null}
    </Card>
  );
}

function TipsList({ tips }) {
  if (!tips.length) return null;
  const visible = tips.slice(0, 3);
  return (
    <Card tone="cyan" padded={false} className="overflow-hidden hover:-translate-y-1">
      <div className="flex items-center gap-3 border-b border-cyan-400/15 bg-gradient-to-r from-cyan-500/10 to-transparent px-5 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/50 bg-gradient-to-br from-cyan-400/30 to-blue-500/20 text-cyan-100 shadow-lg shadow-cyan-500/30">
          <Sparkles size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-white">Smart saving tips</p>
          <p className="text-[10.5px] text-white/60">Personalized for you</p>
        </div>
      </div>
      <ul className="divide-y divide-cyan-400/10">
        {visible.map(t => (
          <li
            key={t._id}
            className="flex items-start gap-2.5 px-5 py-2.5 transition-colors hover:bg-white/[0.03]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow shadow-cyan-400/60" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">{t.title}</p>
              {t.description || t.content ? (
                <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-white/60">
                  {t.description || t.content}
                </p>
              ) : null}
            </div>
            {t.potentialSaving ? (
              <span className="shrink-0 rounded-full border border-emerald-400/50 bg-emerald-500/25 px-2 py-0.5 text-[9.5px] font-bold text-emerald-100 shadow-lg shadow-emerald-500/20">
                {money(t.potentialSaving)}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {tips.length > 3 ? (
        <div className="border-t border-cyan-400/10 px-5 py-2 text-center">
          <p className="text-[10.5px] font-semibold text-cyan-200/80">+{tips.length - 3} more</p>
        </div>
      ) : null}
    </Card>
  );
}

function AttentionList({ notifications }) {
  if (!notifications.length) return null;
  return (
    <Card tone="rose" padded={false} className="overflow-hidden hover:-translate-y-1">
      <div className="flex items-center gap-3 border-b border-rose-400/15 bg-gradient-to-r from-rose-500/10 to-transparent px-5 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-300/50 bg-gradient-to-br from-rose-400/30 to-pink-500/20 text-rose-100 shadow-lg shadow-rose-500/30">
          <Bell size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-white">Attention needed</p>
          <p className="text-[10.5px] text-white/60">
            {notifications.length} live {notifications.length === 1 ? 'notice' : 'notices'}
          </p>
        </div>
      </div>
      <ul className="divide-y divide-rose-400/10">
        {notifications.slice(0, 3).map(n => (
          <li
            key={n._id}
            className="flex items-start gap-2.5 px-5 py-2.5 transition-colors hover:bg-white/[0.03]"
          >
            <CircleAlert size={13} className="mt-0.5 shrink-0 text-amber-300" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">{n.title}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-white/60">
                {n.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {notifications.length > 3 ? (
        <div className="border-t border-rose-400/10 px-5 py-2 text-center">
          <p className="text-[10.5px] font-semibold text-rose-200/80">
            +{notifications.length - 3} more
          </p>
        </div>
      ) : null}
    </Card>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const [view, setView] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [tips, setTips] = useState([]);
  const [error, setError] = useState('');
  const ref = useEntrance([view]);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/dashboard')
      .then(data => {
        if (!cancelled) setView(data);
      })
      .catch(x => {
        if (!cancelled) setError(x.message);
      });

    api
      .get('/announcements')
      .then(res => {
        if (cancelled) return;
        const raw = Array.isArray(res) ? res : res?.items || [];
        const visible = raw
          .filter(a => {
            const s = String(a?.status || 'active').toLowerCase();
            return s === 'active' || s === 'published';
          })
          .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
        setAnnouncements(visible);
      })
      .catch(() => {});

    Promise.all([
      api.get('/saving-tips').catch(() => ({ items: [] })),
      api.get('/tip-templates').catch(() => ({ items: [] })),
    ])
      .then(([mine, campus]) => {
        if (cancelled) return;
        const mineList = Array.isArray(mine) ? mine : mine?.items || [];
        const campusList = Array.isArray(campus) ? campus : campus?.items || [];
        const campusFiltered = campusList
          .filter(t => t?.isActive !== false && t?.status !== 'inactive')
          .sort((a, b) => (a?.priority ?? 5) - (b?.priority ?? 5));
        setTips([...mineList, ...campusFiltered]);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!view) {
    return (
      <main className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }

  const { summary, budgetCards, notifications, forecast } = view;
  const chart = summary.categories || [];
  const cashFlowChart = Object.values(
    (view.dailyActivity || []).reduce((days, entry) => {
      const day = entry._id.day;
      days[day] ||= { day };
      days[day][entry._id.type] = entry.total;
      return days;
    }, {})
  );

  return (
    <main
      ref={ref}
      className="relative mx-auto max-w-[1440px] space-y-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
    >
      <DashboardBanner user={user} month={view.month}>
        <Btn as="a" href="/ocr" variant="teal" icon={<ScanLine size={14} />}>
          Scan receipt
        </Btn>
        <Btn as="a" href="/transactions" variant="primary" icon={<Plus size={14} />}>
          Quick log
        </Btn>
      </DashboardBanner>

      <ErrorBox error={error} />

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Metric
          tone="blue"
          label="Available this month"
          value={money(summary.balance)}
          detail={
            summary.savingsRate
              ? `${summary.savingsRate.toFixed(0)}% of income remains`
              : 'Add income to establish balance'
          }
          icon={<WalletCards size={17} />}
        />
        <Metric
          tone="emerald"
          label="Income"
          value={money(summary.income)}
          detail="Recorded this month"
          icon={<CircleDollarSign size={17} />}
        />
        <Metric
          tone="amber"
          label="Expenses"
          value={money(summary.expense)}
          detail={
            summary.expenseChange === null
              ? 'No prior month to compare'
              : `${summary.expenseChange > 0 ? '+' : ''}${summary.expenseChange.toFixed(0)}% vs last month`
          }
          trend={summary.expenseChange > 0 ? 'negative' : null}
          icon={<ReceiptText size={17} />}
        />
        <Metric
          tone="violet"
          label="Next month forecast"
          value={money(forecast.nextMonthExpense)}
          detail={forecast.method}
          icon={<BarChart3 size={17} />}
        />
      </section>

      <section>
        <Card tone="violet" glow>
          <CardHead title="Monthly cash flow" subtitle="Income and expenses by day" />
          {cashFlowChart.length ? (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowChart} barCategoryGap="32%">
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip
                    content={<FinanceTooltip />}
                    cursor={{ fill: 'rgba(148,163,184,0.1)', radius: 8 }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Empty
              compact
              icon={<BarChart3 size={18} className="text-white/60" />}
              title="No activity this month"
              description="Income and expenses will appear here once recorded."
            />
          )}
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Card tone="cyan" className="h-full" glow>
            <CardHead
              title="Spending breakdown"
              subtitle="Where your money went this month"
            />
            {chart.length ? (
              <BreakdownList data={chart} />
            ) : (
              <Empty
                compact
                icon={<PieChart size={18} className="text-white/60" />}
                title="No spending to analyse"
                description="Your first expense will create a category breakdown."
              />
            )}
          </Card>
        </div>

        <div className="xl:col-span-4">
          <Card tone="emerald" className="h-full" glow>
            <CardHead title="Budget pulse" subtitle="Category caps this month" />
            {budgetCards.length ? (
              <div className="space-y-4">
                {budgetCards.slice(0, 4).map((b, i) => (
                  <BudgetBar
                    key={b._id}
                    name={b.categoryId.name}
                    spent={b.spent}
                    limit={b.limitAmount}
                    warningPercentage={b.warningPercentage}
                    colorIndex={i}
                  />
                ))}
                {budgetCards.length > 4 ? (
                  <p className="pt-1 text-[11.5px] text-white/50">
                    +{budgetCards.length - 4} more budgets
                  </p>
                ) : null}
              </div>
            ) : (
              <Empty
                compact
                icon={<Target size={18} className="text-white/60" />}
                title="No budgets yet"
                description="Set a category cap to get threshold notifications."
              />
            )}
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AnnouncementList items={announcements} />
        <AttentionList notifications={notifications} />
        <TipsList tips={tips} />

        {!announcements.length && !notifications.length && !tips.length ? (
          <div className="lg:col-span-3">
            <Card tone="violet">
              <CardHead title="Stay in the loop" subtitle="Announcements & saving tips" />
              <Empty
                compact
                icon={<Megaphone size={18} className="text-white/60" />}
                title="Nothing here yet"
                description="Campus announcements and personalized tips will appear here."
              />
            </Card>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function TransactionForm({ categories, onClose, onSaved, initial }) {
  const [form, setForm] = useState(
    initial || {
      type: 'expense',
      amount: '',
      categoryId: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      source: '',
      notes: '',
      isRecurring: false,
      recurringType: 'monthly',
    }
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const valid = categories.filter(c => c.type === form.type);

  useEffect(() => {
    if (valid.length && !valid.some(x => x._id === form.categoryId)) {
      setForm(x => ({ ...x, categoryId: valid[0]._id }));
    }
  }, [form.type, categories.length]);

  const validate = (name, val) => {
    let err = '';
    if (name === 'amount') {
      if (val === '' || val === undefined || val === null) err = 'Amount is required.';
      else if (Number(val) <= 0) err = 'Amount must be greater than 0.';
    }
    if (name === 'categoryId' && !val) err = 'Please select a category.';
    if (name === 'date' && !val) err = 'Date is required.';
    return err;
  };

  const update = e => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm(prev => ({ ...prev, [name]: val }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, val) }));
    }
  };

  const handleBlur = name => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, form[name]) }));
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    const amtErr = validate('amount', form.amount);
    const catErr = validate('categoryId', form.categoryId);
    const dateErr = validate('date', form.date);
    setErrors({ amount: amtErr, categoryId: catErr, date: dateErr });
    setTouched({ amount: true, categoryId: true, date: true });
    if (amtErr || catErr || dateErr) {
      notifyError('Validation Error', 'Please check the highlighted transaction fields.');
      return;
    }
    setBusy(true);
    try {
      const data = initial
        ? await api.put(`/transactions/${initial._id}`, form)
        : await api.post('/transactions', form);
      notifySuccess(
        initial ? 'Transaction Updated' : 'Transaction Saved',
        `Recorded PKR ${data.item.amount}`
      );
      onSaved(data.item);
      onClose();
    } catch (x) {
      setError(x.message);
      notifyError('Failed to Save', x.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={initial ? 'Edit transaction' : 'Record a transaction'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          Transaction details
        </p>
        <FormGrid>
          <FieldGroup label="Flow" htmlFor="tx-type">
            <Field as="select" id="tx-type" name="type" value={form.type} onChange={update}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Field>
          </FieldGroup>

          <FieldGroup label="Amount (PKR)" htmlFor="tx-amount" error={errors.amount}>
            <Field
              id="tx-amount"
              name="amount"
              value={form.amount}
              onChange={update}
              onBlur={() => handleBlur('amount')}
              min=".01"
              step=".01"
              type="number"
              placeholder="0.00"
              invalid={!!errors.amount}
            />
          </FieldGroup>

          <FieldGroup label="Category" htmlFor="tx-category" error={errors.categoryId}>
            <Field
              as="select"
              id="tx-category"
              name="categoryId"
              value={form.categoryId}
              onChange={update}
              onBlur={() => handleBlur('categoryId')}
              invalid={!!errors.categoryId}
            >
              {valid.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Field>
          </FieldGroup>

          <FieldGroup label="Date" htmlFor="tx-date" error={errors.date}>
            <Field
              id="tx-date"
              name="date"
              type="date"
              value={form.date?.slice?.(0, 10) || form.date}
              onChange={update}
              onBlur={() => handleBlur('date')}
              invalid={!!errors.date}
            />
          </FieldGroup>

          <FieldGroup label="Description" htmlFor="tx-desc" full>
            <Field
              id="tx-desc"
              name="description"
              value={form.description || ''}
              onChange={update}
              placeholder="e.g. Library coffee or monthly stipend"
            />
          </FieldGroup>

          <FieldGroup label="Source / merchant" htmlFor="tx-source">
            <Field
              id="tx-source"
              name="source"
              value={form.source || ''}
              onChange={update}
              placeholder="e.g. Campus Cafe"
            />
          </FieldGroup>

          <FieldGroup label="Repeat frequency" htmlFor="tx-recurring">
            <Field
              as="select"
              id="tx-recurring"
              name="recurringType"
              value={form.recurringType || 'monthly'}
              onChange={e =>
                setForm(x => ({
                  ...x,
                  isRecurring: e.target.value !== 'none',
                  recurringType: e.target.value === 'none' ? null : e.target.value,
                }))
              }
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Field>
          </FieldGroup>

          <FieldGroup label="Private notes" htmlFor="tx-notes" full>
            <Field
              as="textarea"
              id="tx-notes"
              name="notes"
              value={form.notes || ''}
              onChange={update}
              placeholder="Add optional context or receipt notes..."
            />
          </FieldGroup>
        </FormGrid>

        <ErrorBox error={error} />

        <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
          <Btn type="button" variant="secondary" onClick={onClose} className="sm:w-auto">
            Cancel
          </Btn>
          <Btn type="submit" variant="primary" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              'Save transaction'
            )}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

export function Transactions() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [csvResult, setCsvResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const ref = useEntrance([items.length]);

  const load = () =>
    Promise.all([
      api.get('/transactions', { params: filter ? { type: filter } : {} }),
      api.get('/categories'),
    ])
      .then(([t, c]) => {
        setItems(t.items);
        setCategories(c.items);
      })
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  useEffect(() => {
    const onFocus = () => {
      api.get('/categories').then(c => setCategories(c.items)).catch(() => {});
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const remove = async id => {
    const confirmed = await confirmDialog({
      title: 'Delete this transaction?',
      text: 'This record will be permanently removed from your ledger.',
      confirmButtonText: 'Yes, delete entry',
      cancelButtonText: 'Keep transaction',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/transactions/${id}`);
      setItems(x => x.filter(t => t._id !== id));
      notifySuccess('Transaction Deleted', 'The ledger entry was removed.');
    } catch (x) {
      setError(x.message);
      notifyError('Deletion Failed', x.message);
    }
  };

  const uploadCSV = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    try {
      const result = await api.post('/transactions/import-csv', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCsvResult(result);
      notifySuccess('CSV Imported', `Successfully imported ${result.imported} transactions.`);
      load();
    } catch (x) {
      setError(x.message);
      notifyError('Import Failed', x.message);
    }
  };

  return (
    <main
      ref={ref}
      className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
    >
      <PageTitle
        title="Transactions"
        description="A private, searchable ledger of the money you record."
      >
      <label className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-[0.98]">
  <Upload size={16} className="text-amber-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
  
  <span class="text-slate-200">Import CSV</span>

  <input
    type="file"
    accept=".csv,text/csv"
    className="hidden"
    onChange={uploadCSV}
  />
</label>
        <Btn as="a" href="/ocr" variant="teal" icon={<ScanLine size={15} />}>
          Scan receipt
        </Btn>
        <Btn variant="primary" onClick={() => setModal('new')} icon={<Plus size={15} />}>
          Add entry
        </Btn>
      </PageTitle>

      <ErrorBox error={error} />
      {csvResult ? (
        <SuccessBox>
          <p>Imported {csvResult.imported} rows. {csvResult.errors?.length || 0} rows need correction.</p>
          {csvResult.errors?.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-rose-100">
              {csvResult.errors.map(error => (
                <li key={`${error.row}-${error.message}`}>Row {error.row}: {error.message}</li>
              ))}
            </ul>
          ) : null}
        </SuccessBox>
      ) : null}

      <Card tone="indigo" padded={false} className="overflow-hidden" glow>
        <div className="flex flex-col gap-3 border-b border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-transparent p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Field
              as="select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="!w-auto min-w-[160px]"
            >
              <option value="">All activity</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </Field>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-[11.5px] font-bold text-cyan-100">
              {items.length} records
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <SkeletonRows rows={6} />
          </div>
        ) : !items.length ? (
          <div className="p-6">
            <Empty
              icon={<ReceiptText size={22} className="text-white/60" />}
              title="No entries yet"
              description='Use "Add entry", scan a receipt, or import your own CSV.'
              action={
                <Btn variant="primary" onClick={() => setModal('new')} icon={<Plus size={15} />}>
                  Add your first entry
                </Btn>
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                    <th className="px-5 py-4 text-left text-[10.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Transaction
                    </th>
                    <th className="px-5 py-4 text-left text-[10.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Category
                    </th>
                    <th className="px-5 py-4 text-left text-[10.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Date
                    </th>
                    <th className="px-5 py-4 text-left text-[10.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Method
                    </th>
                    <th className="px-5 py-4 text-right text-[10.5px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Amount
                    </th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((x, i) => {
                    const income = x.type === 'income';
                    const c = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    const name = x.categoryId?.name || 'Uncategorized';
                    return (
                      <tr
                        key={x._id}
                        className="border-b border-white/[0.05] transition-all duration-300 last:border-0 hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`,
                                boxShadow: `0 6px 18px -8px ${c.hex}`,
                              }}
                            >
                              <CategoryIcon name={name} size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold text-white">
                                {x.description || x.source || 'Untitled transaction'}
                              </p>
                              {x.unusuallyLarge ? (
                                <p className="mt-0.5 text-[11px] font-semibold text-amber-300">
                                  Unusually large
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                              income
                                ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                                : 'border-amber-400/50 bg-amber-500/20 text-amber-200'
                            }`}
                          >
                            {name}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[12.5px] text-white/70">
                          {dateLabel(x.date)}
                        </td>
                        <td className="px-5 py-4 text-[12.5px] capitalize text-white/70">
                          {x.inputMethod?.replace('_', ' ') || '—'}
                        </td>
                        <td
                          className={`px-5 py-4 text-right text-[13.5px] font-bold ${
                            income ? 'text-emerald-300' : 'text-amber-300'
                          }`}
                        >
                          {income ? '+' : '−'}
                          {money(x.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModal(x)}
                              aria-label="Edit transaction"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2b7cb6] text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 active:scale-95"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => remove(x._id)}
                              aria-label="Delete transaction"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 active:scale-95"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {items.map((x, i) => {
                const income = x.type === 'income';
                const c = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                const name = x.categoryId?.name || 'Uncategorized';
                return (
                  <div
                    key={x._id}
                    className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.15]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`,
                          boxShadow: `0 6px 18px -8px ${c.hex}`,
                        }}
                      >
                        <CategoryIcon name={name} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-[13.5px] font-semibold text-white">
                            {x.description || x.source || 'Untitled transaction'}
                          </p>
                          <p
                            className={`shrink-0 text-[14px] font-bold ${
                              income ? 'text-emerald-300' : 'text-amber-300'
                            }`}
                          >
                            {income ? '+' : '−'}
                            {money(x.amount)}
                          </p>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold ${
                              income
                                ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                                : 'border-amber-400/50 bg-amber-500/20 text-amber-200'
                            }`}
                          >
                            {name}
                          </span>
                          <span className="text-[11px] text-white/60">{dateLabel(x.date)}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => setModal(x)}
                            className="inline-flex flex-1 items-center justify-center rounded-full pr-3 pl-1 py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[11px] uppercase tracking-wider text-white cursor-pointer bg-[#2b7cb6]"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white mr-2 text-[#2b7cb6]">
                              <Pencil size={13} />
                            </div>
                            <span className="flex-grow text-center pr-1">Edit</span>
                          </button>
                          <button
                            onClick={() => remove(x._id)}
                            className="inline-flex flex-1 items-center justify-center rounded-full pr-3 pl-1 py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[11px] uppercase tracking-wider text-white cursor-pointer bg-[#ef4444]"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white mr-2 text-[#ef4444]">
                              <Trash2 size={13} />
                            </div>
                            <span className="flex-grow text-center pr-1">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {modal ? (
        <TransactionForm
          categories={categories}
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={item =>
            setItems(x =>
              modal === 'new' ? [item, ...x] : x.map(t => (t._id === item._id ? item : t))
            )
          }
        />
      ) : null}
    </main>
  );
}

export function Categories() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'expense', icon: 'tag' });
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get('/categories')
      .then(x => setItems(x.items))
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const validate = val => {
    if (!val.trim()) return 'Category name is required.';
    if (val.trim().length < 2) return 'Category name must be at least 2 characters.';
    return '';
  };

  const submit = async e => {
    e.preventDefault();
    setTouched(true);
    const err = validate(form.name);
    setFieldError(err);
    if (err) {
      notifyError('Validation Error', err);
      return;
    }
    try {
      const x = await api.post('/categories', form);
      setItems(i => [...i, x.item]);
      setForm({ name: '', type: 'expense', icon: 'tag' });
      setFieldError('');
      setTouched(false);
      notifySuccess('Category Created', `Added category "${x.item.name}"`);
    } catch (x) {
      setError(x.message);
      notifyError('Failed to Create Category', x.message);
    }
  };

  const remove = async id => {
    const confirmed = await confirmDialog({
      title: 'Delete this category?',
      text: 'Personal categories with recorded transactions cannot be removed.',
      confirmButtonText: 'Yes, delete category',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/categories/${id}`);
      setItems(x => x.filter(i => i._id !== id));
      notifySuccess('Category Deleted', 'The category was removed.');
    } catch (x) {
      setError(x.message);
      notifyError('Deletion Failed', x.message);
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        title="Categories"
        description="Default categories are shared safely; your personal ones remain yours."
      />
      <ErrorBox error={error} />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card tone="cyan" glow>
          <CardHead
            title="Create a category"
            subtitle="Add labels that make your spending easier to recognise"
          />
          <form onSubmit={submit} noValidate>
            <FormGrid>
              <FieldGroup label="Name" htmlFor="cat-name" error={touched ? fieldError : ''} full>
                <Field
                  id="cat-name"
                  value={form.name}
                  onChange={e => {
                    setForm(x => ({ ...x, name: e.target.value }));
                    if (touched) setFieldError(validate(e.target.value));
                  }}
                  onBlur={() => {
                    setTouched(true);
                    setFieldError(validate(form.name));
                  }}
                  placeholder="e.g. Printing, Snacks"
                  invalid={touched && !!fieldError}
                />
              </FieldGroup>

              <FieldGroup label="Type" htmlFor="cat-type" full>
                <Field
                  as="select"
                  id="cat-type"
                  value={form.type}
                  onChange={e => setForm(x => ({ ...x, type: e.target.value }))}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Field>
              </FieldGroup>
            </FormGrid>
            <div className="mt-5">
              <Btn type="submit" variant="success" icon={<Plus size={15} />}>
                Create category
              </Btn>
            </div>
          </form>
        </Card>

        <Card tone="violet" glow>
          <CardHead
            title="Your categories"
            subtitle={`${items.length} categor${items.length === 1 ? 'y' : 'ies'} in your library`}
          />
          {loading ? (
            <SkeletonRows rows={5} />
          ) : items.length ? (
            <div className="space-y-2.5">
              {items.map((x, i) => {
                const c = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                return (
                  <div
                    key={x._id}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-gradient-to-r from-white/[0.04] to-white/[0.01] px-4 py-3 transition-all duration-300 hover:border-white/[0.18] hover:from-white/[0.08] hover:to-white/[0.02]"
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`,
                        boxShadow: `0 6px 18px -8px ${c.hex}`,
                      }}
                    >
                      <CategoryIcon name={x.name} size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-white">{x.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            x.type === 'income'
                              ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                              : 'border-amber-400/50 bg-amber-500/20 text-amber-200'
                          }`}
                        >
                          {x.type}
                        </span>
                        <span className="text-[11px] text-white/60">
                          {x.isDefault ? 'Campus default' : 'Personal'}
                        </span>
                      </div>
                    </div>
                    {!x.isDefault ? (
                      <button
                        onClick={() => remove(x._id)}
                        aria-label="Delete category"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 active:scale-95"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <Lock size={14} className="text-white/40" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              icon={<Tag size={22} className="text-white/60" />}
              title="No categories yet"
              description="Create your first personal category to organise spending."
            />
          )}
        </Card>
      </section>
    </main>
  );
}

function BudgetForm({ categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    categoryId: categories[0]?._id || '',
    limitAmount: '',
    warningPercentage: 80,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const validate = (name, val) => {
    let err = '';
    if (name === 'categoryId' && !val) err = 'Please select an expense category.';
    if (name === 'limitAmount') {
      if (val === '' || val === undefined) err = 'Monthly budget cap is required.';
      else if (Number(val) <= 0) err = 'Monthly cap must be greater than 0.';
    }
    return err;
  };

  const submit = async e => {
    e.preventDefault();
    const catErr = validate('categoryId', form.categoryId);
    const limitErr = validate('limitAmount', form.limitAmount);
    setErrors({ categoryId: catErr, limitAmount: limitErr });
    setTouched({ categoryId: true, limitAmount: true });
    if (catErr || limitErr) return;
    setBusy(true);
    try {
      const r = await api.post('/budgets', form);
      onSaved(r.item);
      notifySuccess('Budget cap saved');
      onClose();
    } catch (x) {
      notifyError('Could not save budget', x.message);
      setError(x.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Set a category budget" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <FormGrid>
          <FieldGroup label="Expense category" htmlFor="bg-cat" error={errors.categoryId} full>
            <Field
              as="select"
              id="bg-cat"
              value={form.categoryId}
              onChange={e => setForm(x => ({ ...x, categoryId: e.target.value }))}
              invalid={!!errors.categoryId}
            >
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Field>
          </FieldGroup>

          <FieldGroup label="Monthly cap (PKR)" htmlFor="bg-limit" error={errors.limitAmount}>
            <Field
              id="bg-limit"
              type="number"
              min="1"
              value={form.limitAmount}
              onChange={e => {
                setForm(x => ({ ...x, limitAmount: e.target.value }));
                if (touched.limitAmount)
                  setErrors(prev => ({
                    ...prev,
                    limitAmount: validate('limitAmount', e.target.value),
                  }));
              }}
              onBlur={() => setTouched(t => ({ ...t, limitAmount: true }))}
              placeholder="e.g. 5000"
              invalid={!!errors.limitAmount}
            />
          </FieldGroup>

          <FieldGroup label="Notify at" htmlFor="bg-warn">
            <Field
              as="select"
              id="bg-warn"
              value={form.warningPercentage}
              onChange={e => setForm(x => ({ ...x, warningPercentage: e.target.value }))}
            >
              <option value="75">75%</option>
              <option value="80">80%</option>
              <option value="90">90%</option>
            </Field>
          </FieldGroup>
        </FormGrid>

        <ErrorBox error={error} />

        <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
          <Btn type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Btn>
          <Btn type="submit" variant="primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save budget'}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

export function Budgets() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    Promise.all([api.get('/budgets'), api.get('/categories')])
      .then(([b, c]) => {
        setItems(b.items);
        setCategories(c.items.filter(x => x.type === 'expense'));
      })
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const remove = async id => {
    const ok = await confirmDialog({
      title: 'Remove this budget cap?',
      text: "This month's spending data is kept — only the cap is removed.",
      confirmButtonText: 'Remove budget cap',
    });
    if (!ok) return;
    try {
      await api.delete(`/budgets/${id}`);
      setItems(x => x.filter(i => i._id !== id));
      notifySuccess('Budget removed');
    } catch (x) {
      notifyError('Could not remove budget', x.message);
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        eyebrow="Goals & guardrails"
        title="Budget goals"
        description="Budgets compare your current spending with caps you choose. Alerts are automatic."
      >
        <Btn variant="primary" onClick={() => setModal(true)} icon={<Plus size={15} />}>
          Set budget
        </Btn>
      </PageTitle>

      <ErrorBox error={error} />

      <Card tone="emerald" glow>
        {loading ? (
          <SkeletonRows rows={5} />
        ) : items.length ? (
          <div className="space-y-7">
            {items.map((b, i) => (
              <BudgetBar
                key={b._id}
                name={b.categoryId.name}
                spent={b.spent}
                limit={b.limitAmount}
                warningPercentage={b.warningPercentage}
                colorIndex={i}
                onRemove={() => remove(b._id)}
              />
            ))}
          </div>
        ) : (
          <Empty
            icon={<Target size={22} className="text-white/60" />}
            title="No category caps yet"
            description="A budget remains personal and only covers the category and month you choose."
            action={
              <Btn variant="primary" onClick={() => setModal(true)} icon={<Plus size={15} />}>
                Set your first budget
              </Btn>
            }
          />
        )}
      </Card>

      {modal ? (
        <BudgetForm
          categories={categories}
          onClose={() => setModal(false)}
          onSaved={x => {
            setItems(i => [
              ...i.filter(b => b.categoryId._id !== x.categoryId._id),
              { ...x, spent: 0 },
            ]);
            setModal(false);
          }}
        />
      ) : null}
    </main>
  );
}

export function Reports() {
  const [month, setMonth] = useState(monthNow());
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [recipient, setRecipient] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [sharing, setSharing] = useState(false);
  const reportRef = useRef(null);

  const load = () => {
    setData(null);
    api
      .get('/reports', { params: { month } })
      .then(setData)
      .catch(x => setError(x.message));
  };

  useEffect(load, [month]);

  const exportPDF = async () => {
    if (!data) return;

    const doc = new jsPDF('p', 'mm', 'a4');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('Campus Coin — Financial Statement', 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Statement Period: ${month}`, 14, 27);
    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-PK')}`, 14, 32);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 36, 196, 36);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Account Summary', 14, 44);

    autoTable(doc, {
      startY: 48,
      head: [['Monthly Balance', 'Total Income', 'Total Expenses', 'Categories Used']],
      body: [
        [
          money(data.summary.balance),
          money(data.summary.income),
          money(data.summary.expense),
          data.summary.categories.length.toString(),
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4, halign: 'center' },
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Transaction Details', 14, doc.lastAutoTable.finalY + 12);

    try {
      const res = await api.get('/transactions');
      const filteredTx = (res.items || []).filter(tx => tx.date && tx.date.startsWith(month));

      const tableRows = filteredTx.map(tx => [
        dateLabel(tx.date),
        tx.description || tx.source || 'N/A',
        tx.categoryId?.name || 'Uncategorized',
        tx.type.toUpperCase(),
        `${tx.type === 'income' ? '+' : '-'}${money(tx.amount)}`,
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [['Date', 'Description / Source', 'Category', 'Type', 'Amount']],
        body:
          tableRows.length > 0
            ? tableRows
            : [['-', 'No transactions recorded for this period', '-', '-', '-']],
        theme: 'striped',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        styles: { fontSize: 9, cellPadding: 3.5 },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 65 },
          2: { cellWidth: 35 },
          3: { cellWidth: 22 },
          4: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
        },
        didParseCell: function (cellData) {
          if (cellData.section === 'body' && cellData.column.index === 4) {
            const val = cellData.cell.raw || '';
            if (val.startsWith('+')) cellData.cell.styles.textColor = [5, 150, 105];
            else if (val.startsWith('-')) cellData.cell.styles.textColor = [217, 119, 6];
          }
        },
      });
    } catch (err) {
      console.error('Error fetching transactions for PDF:', err);
    }

    doc.save(`campus-coin-statement-${month}.pdf`);
  };

  const exportImage = async () => {
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg'),
      scale: 2,
    });
    const a = document.createElement('a');
    a.download = `campus-coin-${month}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const share = async e => {
    e.preventDefault();
    setEmailTouched(true);
    if (!recipient.trim()) {
      setEmailError('Email is required.');
      return;
    }
    if (!validateEmail(recipient.trim())) {
      setEmailError('Please enter a valid email.');
      return;
    }
    setEmailError('');
    setSharing(true);
    try {
      await api.post('/reports/share', { email: recipient, month });
      setRecipient('');
      setEmailTouched(false);
      notifySuccess('Report sent', `A copy was emailed to ${recipient}.`);
    } catch (x) {
      notifyError('Could not send report', x.message);
      setError(x.message);
    } finally {
      setSharing(false);
    }
  };

  const dailyChart = data
    ? Object.values(
        data.daily.reduce((acc, x) => {
          const day = x._id.day;
          acc[day] ||= { day };
          acc[day][x._id.type] = x.total;
          return acc;
        }, {})
      )
    : [];

  const totalExpense = data ? Number(data.summary.expense || 0) : 0;

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        eyebrow="Real records, useful perspective"
        title="Monthly reports"
        description="Download a report based only on your own saved records."
      >
        <button
          type="button"
          onClick={exportImage}
          disabled={!data}
          className="inline-flex items-center rounded-full pr-4 pl-1 py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[12px] uppercase tracking-wider text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#7a3b9c]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white mr-3 text-[#7a3b9c]">
            <FileImage size={15} />
          </div>
          <span className="flex-grow text-center pr-1">Image</span>
        </button>
        <button
          type="button"
          onClick={exportPDF}
          disabled={!data}
          className="inline-flex items-center rounded-full pr-4 pl-1 py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[12px] uppercase tracking-wider text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#ef4444]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white mr-3 text-[#ef4444]">
            <Download size={15} />
          </div>
          <span className="flex-grow text-center pr-1">PDF</span>
        </button>
      </PageTitle>

      <ErrorBox error={error} />

      <Card tone="blue" glow>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays size={16} className="text-amber-300" />
            <Field
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="!w-auto min-w-[160px]"
            />
          </div>

          <form
            onSubmit={share}
            noValidate
            className="flex flex-col gap-2 sm:flex-row sm:items-start"
          >
            <div className="flex-1">
              <Field
                type="email"
                placeholder="Share report by email"
                value={recipient}
                onChange={e => {
                  setRecipient(e.target.value);
                  if (emailTouched) {
                    if (!e.target.value.trim()) setEmailError('Email is required.');
                    else if (!validateEmail(e.target.value.trim()))
                      setEmailError('Please enter a valid email.');
                    else setEmailError('');
                  }
                }}
                onBlur={() => {
                  setEmailTouched(true);
                  if (!recipient.trim()) setEmailError('Email is required.');
                  else if (!validateEmail(recipient.trim()))
                    setEmailError('Please enter a valid email.');
                  else setEmailError('');
                }}
                invalid={emailTouched && !!emailError}
              />
              {emailTouched && emailError ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-rose-400">
                  <AlertCircle size={12} /> {emailError}
                </p>
              ) : null}
            </div>
            <Btn type="submit" variant="primary" disabled={sharing} icon={<Send size={14} />}>
              {sharing ? 'Sending…' : 'Share'}
            </Btn>
          </form>
        </div>
      </Card>

      {!data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
      ) : (
        <section ref={reportRef} className="space-y-5 pb-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              tone="blue"
              label="Monthly balance"
              value={money(data.summary.balance)}
              detail={month}
              icon={<WalletCards size={18} />}
            />
            <Metric
              tone="emerald"
              label="Income"
              value={money(data.summary.income)}
              detail="Total recorded"
              icon={<CircleDollarSign size={18} />}
            />
            <Metric
              tone="amber"
              label="Expenses"
              value={money(data.summary.expense)}
              detail="Total recorded"
              icon={<ReceiptText size={18} />}
            />
            <Metric
              tone="violet"
              label="Categories"
              value={data.summary.categories.length}
              detail="Expense categories used"
              icon={<Target size={18} />}
            />
          </div>

          <Card tone="cyan" glow>
            <CardHead title="Expense allocation" subtitle="Multi-color split of your spending" />
            {data.summary.categories.length ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
                <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 blur-3xl" />
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {data.summary.categories.map((_, i) => (
                          <linearGradient
                            id={`report-donut-${i}`}
                            key={i}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CATEGORY_COLORS[i % CATEGORY_COLORS.length].grad[0]}
                            />
                            <stop
                              offset="100%"
                              stopColor={CATEGORY_COLORS[i % CATEGORY_COLORS.length].grad[1]}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={data.summary.categories}
                        dataKey="amount"
                        nameKey="name"
                        innerRadius="66%"
                        outerRadius="100%"
                        paddingAngle={3}
                        cornerRadius={8}
                        stroke="transparent"
                        strokeWidth={3}
                      >
                        {data.summary.categories.map((_, i) => (
                          <Cell key={i} fill={`url(#report-donut-${i})`} />
                        ))}
                      </Pie>
                      <Tooltip content={<FinanceTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/60">
                      Total spent
                    </p>
                    <p className="mt-1 text-[19px] font-bold tracking-tight text-white">
                      {money(totalExpense)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.summary.categories.map((c, i) => {
                    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                    const pct = totalExpense ? (c.amount / totalExpense) * 100 : 0;
                    return (
                      <div key={c.name} className="group flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10 transition-transform duration-300 group-hover:scale-125"
                          style={{
                            background: `linear-gradient(135deg, ${color.grad[0]}, ${color.grad[1]})`,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13px] font-semibold text-white">
                              {c.name}
                            </p>
                            <p className="shrink-0 text-[12.5px] font-bold text-white">
                              {money(c.amount)}
                            </p>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, ${color.grad[0]}, ${color.grad[1]})`,
                                boxShadow: `0 0 12px ${color.hex}80`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-10 shrink-0 text-right text-[11.5px] font-bold text-white/60">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Empty
                icon={<PieChart size={22} className="text-white/60" />}
                title="No expenses in this period"
                description="Once you record expenses, the allocation will appear here."
              />
            )}
          </Card>

          <Card tone="violet" glow>
            <CardHead title="Daily activity" subtitle="Income and expense entries over time" />
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChart} barCategoryGap="32%">
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fcd34d" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip
                    content={<FinanceTooltip />}
                    cursor={{ fill: 'rgba(148,163,184,0.1)', radius: 8 }}
                  />
                  <Bar dataKey="income" stackId="x" fill="url(#incomeGrad)" />
                  <Bar
                    dataKey="expense"
                    stackId="x"
                    fill="url(#expenseGrad)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      )}
    </main>
  );
}

export function Insights() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .get('/insights')
      .then(x => setItems(x.items))
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    setBusy(true);
    setError('');
    try {
      const x = await api.post('/ai/monthly-insight', {});
      setItems(i => [x.item, ...i]);
      notifySuccess('Insight generated', 'Your new AI spending insight is ready.');
    } catch (x) {
      notifyError('Could not generate insight', x.message);
      setError(x.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        eyebrow="Your data, intelligent context"
        title="AI spending insights"
        description="Generate Insight reports based on your own records. Gemini is required to use this feature."
      >
        <Btn
          variant="violet"
          onClick={generate}
          disabled={busy}
          icon={busy ? <LoaderCircle size={15} className="animate-spin" /> : <BrainCircuit size={15} />}
        >
          {busy ? 'Generating…' : 'Generate insight'}
        </Btn>
      </PageTitle>

      <ErrorBox error={error} />

      {loading ? (
        <div className="space-y-4">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={3} />
        </div>
      ) : items.length ? (
        <div className="space-y-4">
          {items.map(i => (
            <Card key={i._id} tone="violet" glow className="hover:-translate-y-0.5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/50 bg-gradient-to-br from-violet-400/30 to-purple-500/20 text-violet-100 shadow-lg shadow-violet-500/30">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white">
                      {new Date(`${i.month}-01`).toLocaleDateString('en', {
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      insight
                    </p>
                    <p className="text-[11.5px] text-white/60">AI-assisted monthly summary</p>
                  </div>
                </div>
                <span className="rounded-full border border-violet-300/50 bg-violet-400/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-100">
                  AI
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-white/90">
                {i.summaryText}
              </p>
              <p className="mt-4 text-[11px] text-white/50">
                Educational guidance only · {new Date(i.generatedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          icon={<BrainCircuit size={24} className="text-white/60" />}
          title="No AI insights yet"
          description="Generate a real analysis once Gemini is configured and you have records to analyse."
          action={
            <Btn variant="violet" onClick={generate} disabled={busy} icon={<Sparkles size={14} />}>
              {busy ? 'Generating…' : 'Generate insight'}
            </Btn>
          }
        />
      )}
    </main>
  );
}

export function Tips() {
  const [personalTips, setPersonalTips] = useState([]);
  const [campusTips, setCampusTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [mine, campus] = await Promise.all([
        api.get('/saving-tips').catch(() => ({ items: [] })),
        api.get('/tip-templates').catch(() => ({ items: [] })),
      ]);

      const mineList = Array.isArray(mine) ? mine : mine?.items || [];
      const campusList = Array.isArray(campus) ? campus : campus?.items || [];

      const visibleCampus = campusList
        .filter(t => t?.isActive !== false && t?.status !== 'inactive')
        .sort((a, b) => (a?.priority ?? 5) - (b?.priority ?? 5));

      setPersonalTips(mineList);
      setCampusTips(visibleCampus);
    } catch (x) {
      setError(x.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const action = async (id, act) => {
    try {
      const x = await api.put(`/saving-tips/${id}/${act}`);
      setPersonalTips(i =>
        act === 'dismiss'
          ? i.filter(t => t._id !== id)
          : i.map(t => (t._id === id ? x.item : t))
      );
    } catch (x) {
      notifyError('Action failed', x.message);
      setError(x.message);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <SkeletonCard lines={2} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} lines={3} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <Card padded={false} tone="blue" className="relative overflow-hidden p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-cyan-400/40 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/40 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/50">
            <Lightbulb size={28} className="text-white" />
          </div>
          <h1 className="mt-6 bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-[1.7rem] font-bold leading-tight tracking-tight text-transparent sm:text-[2rem]">
            Smart Saving Tips
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-white/80">
            Discover personalized recommendations and campus-wide advice to help you save more
            and spend smarter.
          </p>
        </div>
      </Card>

      <ErrorBox error={error} />

      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/40">
            <Megaphone size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold tracking-tight text-white">
              From Campus Coin
            </h2>
            <p className="text-[12.5px] text-slate-400">
              Official tips and tricks from the admin team
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-400/50 bg-amber-500/20 px-3.5 py-1.5 text-[11px] font-bold text-amber-100">
            {campusTips.length} tips
          </span>
        </div>

        {campusTips.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campusTips.map((t, i) => {
              const c = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <Card
                  key={t._id}
                  tone="amber"
                  className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[3px] opacity-90 transition-opacity group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, ${c.grad[0]}, ${c.grad[1]})`,
                      boxShadow: `0 0 16px ${c.hex}`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: c.hex }}
                  />
                  <div className="relative flex items-start justify-between gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`,
                        boxShadow: `0 8px 22px -8px ${c.hex}`,
                      }}
                    >
                      <Lightbulb size={20} />
                    </div>
                    {t.priority !== undefined && t.priority !== null ? (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: c.hex, backgroundColor: `${c.hex}25` }}
                      >
                        Priority {t.priority}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="relative mt-4 text-[15px] font-bold text-white">{t.title}</h3>
                  <p className="relative mt-2 text-[13px] leading-relaxed text-white/80">
                    {t.content}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <Empty
            icon={<Lightbulb size={22} className="text-white/60" />}
            title="No campus tips yet"
            description="Admin-published system-wide tips will appear here."
          />
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/40">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[18px] font-bold tracking-tight text-white">
              Personalized for you
            </h2>
            <p className="text-[12.5px] text-slate-400">
              Smart suggestions based on your spending habits
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-indigo-400/50 bg-indigo-500/20 px-3.5 py-1.5 text-[11px] font-bold text-indigo-100">
            {personalTips.length} suggestions
          </span>
        </div>

        {personalTips.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personalTips.map((t, i) => {
              const c = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <Card
                  key={t._id}
                  tone="indigo"
                  className="group flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`,
                        boxShadow: `0 8px 22px -8px ${c.hex}`,
                      }}
                    >
                      <Lightbulb size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => action(t._id, 'pin')}
                      aria-label="Bookmark tip"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f5a623] text-white shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                    >
                      <Bookmark fill={t.isPinned ? 'currentColor' : 'none'} size={14} />
                    </button>
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-white">{t.title}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/80">
                    {t.description}
                  </p>
                  {t.potentialSaving !== undefined ? (
                    <div className="mt-4 rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 px-4 py-3 shadow-lg shadow-emerald-950/40">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-200">
                        Potential saving
                      </p>
                      <p className="mt-0.5 text-[15px] font-bold text-emerald-100">
                        {money(t.potentialSaving)}
                      </p>
                    </div>
                  ) : null}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => action(t._id, 'dismiss')}
                      className="inline-flex w-full items-center justify-center rounded-full pr-3 pl-1 py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[11px] uppercase tracking-wider text-white cursor-pointer bg-[#ef4444]"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white mr-2 text-[#ef4444]">
                        <Trash2 size={13} />
                      </div>
                      <span className="flex-grow text-center pr-1">Dismiss</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Empty
            icon={<Sparkles size={22} className="text-white/60" />}
            title="No recommendations yet"
            description="Once you log expenses, Campus Coin can surface a simple personal opportunity."
          />
        )}
      </section>
    </main>
  );
}

const ASSISTANT_WELCOME = {
  role: 'assistant',
  content:
    'Ask about your recorded spending, budgets, categories, or forecast. I’ll use only your Campus Coin data.',
};

export function Assistant() {
  const [messages, setMessages] = useState([ASSISTANT_WELCOME]);
  const [message, setMessage] = useState('');
  const [msgError, setMsgError] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [aiStatus, setAiStatus] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    api
      .get('/ai/chat')
      .then(x => {
        if (x.items?.length) {
          setMessages(x.items.map(m => ({ role: m.role, content: m.content })));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, busy]);

  const clear = async () => {
    if (busy) return;
    try {
      await api.delete('/ai/chat');
      setMessages([ASSISTANT_WELCOME]);
      setAiStatus(null);
      setError('');
    } catch (x) {
      setError(x?.message || 'Unable to clear the conversation.');
    }
  };

  const send = async e => {
    e.preventDefault();
    if (!message.trim()) {
      setMsgError('Please enter a question.');
      return;
    }
    if (busy) return;

    setMsgError('');
    setError('');

    const text = message.trim();
    setMessages(x => [...x, { role: 'user', content: text }]);
    setMessage('');
    setBusy(true);

    try {
      const x = await api.post('/ai/chat', { message: text });

      if (x.aiFailed) {
        setAiStatus({
          type: 'warning',
          detail: x.aiErrorDetail || 'Gemini unavailable',
        });
      } else {
        setAiStatus({ type: 'ok' });
      }

      setMessages(m => [
        ...m,
        { role: 'assistant', content: x.answer, disclaimer: x.disclaimer },
      ]);
    } catch (x) {
      const msg = x?.message || 'AI request failed.';
      setError(msg);
      setMessages(m => [...m, { role: 'assistant', content: `⚠️ ${msg}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        eyebrow="Private, educational guidance"
        title="Campus Coin assistant"
        description="The assistant cannot see anybody else's transactions and isn't a certified financial adviser."
      >
        <Btn
          variant="danger"
          onClick={clear}
          disabled={busy || loadingHistory || messages.length <= 1}
          icon={<Trash2 size={14} />}
        >
          Clear conversation
        </Btn>
      </PageTitle>

      <ErrorBox error={error} />

      {aiStatus?.type === 'warning' ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-amber-500/[0.02] px-4 py-3.5 shadow-lg shadow-amber-950/40 backdrop-blur">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <div className="text-[12.5px] leading-relaxed text-amber-100">
            <p className="font-bold">AI service unavailable</p>
            <p className="mt-0.5 text-amber-200/80">
              Falling back to your data summary. Detail:{' '}
              <code className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[11px]">
                {aiStatus.detail}
              </code>
            </p>
          </div>
        </div>
      ) : null}

      <Card tone="cyan" padded={false} className="overflow-hidden" glow>
        <div
          ref={scrollRef}
          className="max-h-[62vh] min-h-[440px] space-y-4 overflow-y-auto p-5 sm:p-6"
        >
          {messages.map((x, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                x.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {x.role === 'assistant' ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-[#03111f] shadow-lg shadow-cyan-500/40">
                  <Sparkles size={15} />
                </div>
              ) : null}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                  x.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30'
                    : 'border border-white/[0.1] bg-gradient-to-br from-white/[0.08] to-white/[0.03] text-white shadow-lg shadow-black/20'
                }`}
              >
                <p className="whitespace-pre-wrap">{x.content}</p>
                {x.disclaimer ? (
                  <p
                    className={`mt-2 text-[11px] ${
                      x.role === 'user' ? 'text-white/75' : 'text-white/50'
                    }`}
                  >
                    {x.disclaimer}
                  </p>
                ) : null}
              </div>
              {x.role === 'user' ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-slate-200">
                  <UserRound size={15} />
                </div>
              ) : null}
            </div>
          ))}
          {busy ? (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-[#03111f] shadow-lg shadow-cyan-500/40">
                <Sparkles size={15} />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-4 py-3 text-[13px] text-white/70">
                <LoaderCircle size={14} className="animate-spin text-cyan-300" />
                Thinking with your records…
              </div>
            </div>
          ) : null}
        </div>

        <form
          onSubmit={send}
          noValidate
          className="flex flex-col gap-3 border-t border-white/[0.08] bg-gradient-to-r from-white/[0.02] to-transparent p-4 sm:flex-row sm:items-start sm:p-5"
        >
          <div className="flex-1">
            <Field
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                if (e.target.value.trim()) setMsgError('');
              }}
              placeholder="e.g. Where did I spend most this month?"
              maxLength="1000"
              invalid={!!msgError}
            />
            {msgError ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-rose-400">
                <AlertCircle size={12} /> {msgError}
              </p>
            ) : null}
          </div>
          <Btn
            type="submit"
            variant="primary"
            disabled={busy}
            className="w-full sm:w-auto"
            icon={busy ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}
          >
            Send
          </Btn>
        </form>
      </Card>
    </main>
  );
}

export function OCRScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get('/categories')
      .then(x => setCategories(x.items.filter(c => c.type === 'expense')))
      .catch(x => setError(x.message));
  }, []);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    setSaved(false);
    const data = new FormData();
    data.append('receipt', file);
    try {
      const x = await api.post('/transactions/ocr/process', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 55_000,
      });
      setResult(x.item);
      setForm({
        amount: x.item.detectedAmount || '',
        description: x.item.detectedDescription || '',
        date: x.item.detectedDate
          ? x.item.detectedDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        type: 'expense',
        categoryId: x.item.detectedCategory?._id || categories[0]?._id || '',
        source: '',
      });
    } catch (x) {
      setError(x.message);
    } finally {
      setBusy(false);
    }
  };

  const validate = (name, val) => {
    let err = '';
    if (name === 'amount') {
      if (val === '' || val === undefined) err = 'Amount is required.';
      else if (Number(val) <= 0) err = 'Amount must be greater than 0.';
    }
    if (name === 'date' && !val) err = 'Date is required.';
    if (name === 'categoryId' && !val) err = 'Category is required.';
    return err;
  };

  const save = async e => {
    e.preventDefault();
    const amtErr = validate('amount', form.amount);
    const dateErr = validate('date', form.date);
    const catErr = validate('categoryId', form.categoryId);
    setErrors({ amount: amtErr, date: dateErr, categoryId: catErr });
    if (amtErr || dateErr || catErr) return;
    try {
      await api.post(`/transactions/ocr/${result._id}/confirm`, form);
      setSaved(true);
      notifySuccess('Receipt saved', 'The transaction is now in your ledger.');
    } catch (x) {
      notifyError('Could not save receipt', x.message);
      setError(x.message);
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        eyebrow="Review before anything is saved"
        title="Scan a receipt"
        description="Tesseract extracts text from your image. Campus Coin never silently writes an OCR transaction."
      />
      <ErrorBox error={error} />

      <section className="grid gap-5 lg:grid-cols-2">
        <Card tone="cyan" glow>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-[12px] font-bold text-[#03111f] shadow-lg shadow-cyan-500/40">
              1
            </span>
            <div>
              <h2 className={HEADING}>Upload receipt</h2>
              <p className={SUB}>JPEG, PNG, or WebP up to 5 MB.</p>
            </div>
          </div>

          <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/[0.18] bg-gradient-to-br from-white/[0.04] to-white/[0.01] px-6 py-12 text-center transition-all duration-300 hover:border-cyan-400/70 hover:from-cyan-500/[0.08] hover:to-cyan-500/[0.02]">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-cyan-300 shadow-lg shadow-cyan-950/40 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <ScanLine size={26} />
            </span>
            <div>
              <p className="text-[14px] font-bold text-white">
                {file ? file.name : 'Choose a receipt image'}
              </p>
              <p className="mt-1 text-[12px] text-white/60">
                Click to browse or drag and drop
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <div className="mt-5">
            <Btn
              variant="primary"
              onClick={run}
              disabled={!file || busy}
              className="w-full"
              icon={busy ? <LoaderCircle size={15} className="animate-spin" /> : <Sparkles size={15} />}
            >
              {busy ? 'Reading receipt…' : 'Extract receipt text'}
            </Btn>
          </div>

          {result ? (
            <>
              <p className="mb-3 mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Extracted text
              </p>
              <div className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/[0.1] bg-slate-950/80 p-4 font-mono text-[12px] leading-relaxed text-white/90 shadow-inner shadow-black/40">
                {result.extractedText}
              </div>
            </>
          ) : null}
        </Card>

        <Card tone="violet" glow>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[12px] font-bold text-white shadow-lg shadow-violet-500/40">
              2
            </span>
            <div>
              <h2 className={HEADING}>Confirm the details</h2>
              <p className={SUB}>Edit every field before saving to your ledger.</p>
            </div>
          </div>

          {form ? (
            <form onSubmit={save} noValidate>
              <FormGrid>
                <FieldGroup label="Amount (PKR)" htmlFor="ocr-amount" error={errors.amount}>
                  <Field
                    id="ocr-amount"
                    type="number"
                    step=".01"
                    min=".01"
                    value={form.amount}
                    onChange={e => {
                      setForm(x => ({ ...x, amount: e.target.value }));
                      setErrors(prev => ({
                        ...prev,
                        amount: validate('amount', e.target.value),
                      }));
                    }}
                    invalid={!!errors.amount}
                  />
                </FieldGroup>

                <FieldGroup label="Date" htmlFor="ocr-date" error={errors.date}>
                  <Field
                    id="ocr-date"
                    type="date"
                    value={form.date}
                    onChange={e => {
                      setForm(x => ({ ...x, date: e.target.value }));
                      setErrors(prev => ({ ...prev, date: validate('date', e.target.value) }));
                    }}
                    invalid={!!errors.date}
                  />
                </FieldGroup>

                <FieldGroup
                  label="Category"
                  htmlFor="ocr-category"
                  error={errors.categoryId}
                  full
                >
                  <Field
                    as="select"
                    id="ocr-category"
                    value={form.categoryId}
                    onChange={e => {
                      setForm(x => ({ ...x, categoryId: e.target.value }));
                      setErrors(prev => ({
                        ...prev,
                        categoryId: validate('categoryId', e.target.value),
                      }));
                    }}
                    invalid={!!errors.categoryId}
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                </FieldGroup>

                <FieldGroup label="Description" htmlFor="ocr-desc" full>
                  <Field
                    id="ocr-desc"
                    value={form.description}
                    onChange={e => setForm(x => ({ ...x, description: e.target.value }))}
                  />
                </FieldGroup>

                <FieldGroup label="Merchant / source" htmlFor="ocr-source" full>
                  <Field
                    id="ocr-source"
                    value={form.source}
                    onChange={e => setForm(x => ({ ...x, source: e.target.value }))}
                  />
                </FieldGroup>
              </FormGrid>

              <div className="mt-5">
                <Btn
                  type="submit"
                  variant="success"
                  disabled={saved}
                  className="w-full"
                  icon={<Check size={15} />}
                >
                  {saved ? 'Saved to your ledger' : 'Confirm and save'}
                </Btn>
              </div>

              {saved ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/[0.03] px-4 py-3 shadow-lg shadow-emerald-950/40">
                  <CircleCheck size={16} className="mt-0.5 shrink-0 text-emerald-300" />
                  <p className="text-[12.5px] leading-relaxed text-emerald-100">
                    Saved. Your reviewed receipt entry is now in the ledger.
                  </p>
                </div>
              ) : null}
            </form>
          ) : (
            <Empty
              icon={<ReceiptText size={22} className="text-white/60" />}
              title="Waiting for an image"
              description="Your editable extraction preview will appear here."
            />
          )}
        </Card>
      </section>
    </main>
  );
}

export function Profile() {
  const { user, setUser } = useAuth();
  const isStudent = user.role === 'student';
  const [form, setForm] = useState({
    name: user.name,
    academicYear: user.academicYear || '',
    monthlyAllowance: user.monthlyAllowance || '',
    savingsGoal: user.savingsGoal || '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');

  const validate = (name, val) => {
    let err = '';
    if (name === 'name') {
      if (!val.trim()) err = 'Name is required.';
      else if (val.trim().length < 2) err = 'Name must be at least 2 characters.';
    }
    if (name === 'monthlyAllowance' && val !== '' && Number(val) < 0) {
      err = 'Allowance cannot be negative.';
    }
    if (name === 'savingsGoal' && val !== '' && Number(val) < 0) {
      err = 'Savings goal cannot be negative.';
    }
    return err;
  };

  const update = e => {
    const { name, value } = e.target;
    setForm(x => ({ ...x, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = name => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, form[name]) }));
  };

  const save = async e => {
    e.preventDefault();
    const nErr = validate('name', form.name);
    const mErr = isStudent ? validate('monthlyAllowance', form.monthlyAllowance) : '';
    const sErr = isStudent ? validate('savingsGoal', form.savingsGoal) : '';
    setErrors(isStudent ? { name: nErr, monthlyAllowance: mErr, savingsGoal: sErr } : { name: nErr });
    setTouched(isStudent ? { name: true, monthlyAllowance: true, savingsGoal: true } : { name: true });
    if (nErr || mErr || sErr) return;
    try {
      const x = await api.put('/profile', isStudent ? form : { name: form.name });
      setUser(x.user);
      notifySuccess('Profile saved', 'Your changes have been saved securely.');
    } catch (x) {
      notifyError('Could not save profile', x.message);
      setError(x.message);
    }
  };

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        eyebrow={isStudent ? 'Student baseline' : 'Account settings'}
        title="Profile & settings"
        description={
          isStudent
            ? 'Keep your academic and financial baseline up to date for smarter insights.'
            : 'Manage your account profile details.'
        }
      />
      <ErrorBox error={error} />

      <form onSubmit={save} noValidate className="space-y-5">
        <Card tone="cyan" glow>
          <CardHead title="Profile information" subtitle="How Campus Coin greets you" />
          <FormGrid>
            <FieldGroup label="Name" htmlFor="prof-name" error={errors.name} full>
              <Field
                id="prof-name"
                name="name"
                value={form.name}
                onChange={update}
                onBlur={() => handleBlur('name')}
                invalid={!!errors.name}
              />
            </FieldGroup>
          </FormGrid>
        </Card>

        {isStudent ? (
          <>
            <Card tone="violet" glow>
              <CardHead
                title="Academic information"
                subtitle="Helps us tune context around student life"
              />
              <FormGrid>
                <FieldGroup label="Academic year" htmlFor="prof-year" full>
                  <Field
                    id="prof-year"
                    name="academicYear"
                    value={form.academicYear}
                    onChange={update}
                    placeholder="e.g. Year 2"
                  />
                </FieldGroup>
              </FormGrid>
            </Card>

            <Card tone="emerald" glow>
              <CardHead
                title="Financial baseline"
                subtitle="A reference for insights and saving opportunities"
              />
              <FormGrid>
                <FieldGroup
                  label="Monthly allowance baseline (PKR)"
                  htmlFor="prof-allowance"
                  error={errors.monthlyAllowance}
                >
                  <Field
                    id="prof-allowance"
                    type="number"
                    min="0"
                    name="monthlyAllowance"
                    value={form.monthlyAllowance}
                    onChange={update}
                    onBlur={() => handleBlur('monthlyAllowance')}
                    invalid={!!errors.monthlyAllowance}
                  />
                </FieldGroup>

                <FieldGroup label="Savings goal (PKR)" htmlFor="prof-goal" error={errors.savingsGoal}>
                  <Field
                    id="prof-goal"
                    type="number"
                    min="0"
                    name="savingsGoal"
                    value={form.savingsGoal}
                    onChange={update}
                    onBlur={() => handleBlur('savingsGoal')}
                    invalid={!!errors.savingsGoal}
                  />
                </FieldGroup>
              </FormGrid>
            </Card>
          </>
        ) : null}

        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Btn type="submit" variant="success" icon={<Check size={15} />}>
            Save profile
          </Btn>
        </div>
      </form>
    </main>
  );
}

export function Notifications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/notifications')
      .then(x => setItems(x.items))
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));
  }, []);

  const read = async item => {
    try {
      const x = await api.put(`/notifications/${item._id}`, { isRead: true });
      setItems(i => i.map(n => (n._id === item._id ? x.item : n)));
    } catch (x) {
      notifyError('Could not mark notification', x.message);
      setError(x.message);
    }
  };

  const unreadCount = items.filter(i => !i.isRead).length;

  return (
    <main className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <PageTitle
        title="Notifications"
        description="Budget thresholds, unusual entries, and insights appear here."
      >
        <span className="rounded-full border border-cyan-400/40 bg-cyan-400/15 px-3.5 py-1.5 text-[12px] font-bold text-cyan-100">
          {unreadCount} unread of {items.length}
        </span>
      </PageTitle>
      <ErrorBox error={error} />

      <Card tone="rose" padded={false} glow>
        {loading ? (
          <div className="p-6">
            <SkeletonRows rows={5} />
          </div>
        ) : items.length ? (
          <div className="divide-y divide-white/[0.08]">
            {items.map(i => (
              <div
                key={i._id}
                className={`group flex items-start gap-4 p-5 transition-all duration-300 hover:bg-white/[0.03] ${
                  i.isRead ? 'opacity-60' : ''
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-lg transition-transform duration-500 group-hover:scale-105 ${
                    i.isRead
                      ? 'border-white/[0.12] bg-white/[0.04] text-white/60'
                      : 'border-amber-400/50 bg-gradient-to-br from-amber-500/30 to-orange-500/15 text-amber-200 shadow-amber-500/30'
                  }`}
                >
                  <Bell size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13.5px] font-bold text-white">{i.title}</p>
                    {!i.isRead ? (
                      <span className="rounded-full border border-cyan-400/50 bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/80">{i.message}</p>
                  <p className="mt-2 text-[11px] font-semibold text-white/50">
                    {dateLabel(i.createdAt)}
                  </p>
                </div>
                {!i.isRead ? (
                  <button
                    type="button"
                    onClick={() => read(i)}
                    className="inline-flex shrink-0 items-center rounded-full pr-2.5 pl-1 py-1 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.97] font-bold text-[10.5px] uppercase tracking-wider text-white cursor-pointer bg-[#2b7cb6]"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white mr-2 text-[#2b7cb6]">
                      <Check size={11} />
                    </div>
                    <span className="flex-grow text-center pr-1">Mark read</span>
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <Empty
              icon={<Bell size={22} className="text-white/60" />}
              title="No notifications"
              description="You're all caught up."
            />
          </div>
        )}
      </Card>
    </main>
  );
}
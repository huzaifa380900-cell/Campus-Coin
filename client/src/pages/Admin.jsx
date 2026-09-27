import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle, ArrowUpRight, BarChart3, BookOpen, Check, ChevronDown, ChevronLeft,
  ChevronRight, ChevronUp, Edit3, Eye, FileSpreadsheet, FileText, Megaphone, Plus,
  Printer, RefreshCw, RotateCcw, Search, Shield, ShieldCheck, Sparkles, Tag, Trash2,
  TrendingUp, Users, UserX, WalletCards, X,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { confirmDialog, notifyError, notifySuccess } from '../utils/swal.js';

const PALETTE = [
  '#22d3ee', '#818cf8', '#34d399', '#fbbf24', '#fb7185', '#c084fc', '#f472b6', '#2dd4bf',
];

const BTN = {
  primary:
    'group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-bold text-[#03111f] shadow-lg shadow-cyan-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
  secondary:
    'group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-200 shadow-lg shadow-black/20 backdrop-blur transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 hover:shadow-cyan-500/20 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-cyan-500/15 hover:text-cyan-300 disabled:opacity-40',
  enable:
    'group inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97] disabled:opacity-50 disabled:hover:translate-y-0',
  disable:
    'group inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97] disabled:opacity-50 disabled:hover:translate-y-0',
  reset:
    'group inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-amber-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97] disabled:opacity-50 disabled:hover:translate-y-0',
  violet:
    'group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97]',
  emerald:
    'group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97]',
  rose:
    'group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97]',
  amber:
    'group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/40 ring-1 ring-inset ring-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/60 hover:brightness-110 hover:-translate-y-0.5 active:scale-[.97]',
};

const FIELD =
  'w-full rounded-xl border border-white/[0.1] bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/30 outline-none transition-all duration-300 focus:border-cyan-400/70 focus:bg-slate-950/90 focus:ring-4 focus:ring-cyan-400/15';

const CARD =
  'relative overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-300';

const getUserId = user => user?._id ?? user?.id ?? user?.userId ?? null;

const checkIsActive = user => {
  if (!user) return false;
  if (user.isActive === true || user.isActive === 'true' || user.isActive === 1 || user.isActive === '1') return true;
  if (user.active === true || user.active === 'true' || user.active === 1) return true;
  if (user.status && (user.status.toLowerCase() === 'active' || user.status.toLowerCase() === 'enabled')) return true;
  return false;
};

const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid rgba(34, 211, 238, 0.6)',
    fontSize: 13,
    fontWeight: 600,
    boxShadow: '0 20px 45px -12px rgba(0,0,0,0.9)',
    padding: '10px 14px',
    background: '#1e293b',
    color: '#ffffff',
  },
  itemStyle: {
    color: '#e2e8f0',
    fontSize: 13,
    padding: '2px 0',
  },
  labelStyle: {
    fontWeight: 700,
    color: '#22d3ee',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
};

function Loader() {
  return (
    <div className="flex justify-center py-20">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500" />
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400/50 to-blue-500/30 blur-md" />
      </div>
    </div>
  );
}

function ErrorBox({ error }) {
  if (!error) return null;
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-500/20 via-rose-500/10 to-rose-500/[0.02] px-4 py-3.5 text-sm text-rose-100 shadow-lg shadow-rose-950/50 backdrop-blur">
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
      <span className="font-medium">{error}</span>
    </div>
  );
}

function StatCard({ label, value, detail, icon, accent = 'cyan', trend }) {
  const accents = {
    cyan: {
      glow: 'from-cyan-400/40 via-blue-500/20 to-transparent',
      iconBg: 'from-cyan-400 to-blue-500 shadow-cyan-500/50',
      accent: 'text-cyan-300',
      border: 'hover:border-cyan-400/50',
      grad: 'from-cyan-500/[0.10] via-slate-950/95 to-blue-500/[0.04]',
      shadow: 'hover:shadow-cyan-500/30',
    },
    emerald: {
      glow: 'from-emerald-400/40 via-teal-500/20 to-transparent',
      iconBg: 'from-emerald-400 to-teal-500 shadow-emerald-500/50',
      accent: 'text-emerald-300',
      border: 'hover:border-emerald-400/50',
      grad: 'from-emerald-500/[0.10] via-slate-950/95 to-teal-500/[0.04]',
      shadow: 'hover:shadow-emerald-500/30',
    },
    rose: {
      glow: 'from-rose-500/40 via-pink-500/20 to-transparent',
      iconBg: 'from-rose-500 to-pink-600 shadow-rose-500/50',
      accent: 'text-rose-300',
      border: 'hover:border-rose-400/50',
      grad: 'from-rose-500/[0.10] via-slate-950/95 to-pink-500/[0.04]',
      shadow: 'hover:shadow-rose-500/30',
    },
    amber: {
      glow: 'from-amber-400/40 via-orange-500/20 to-transparent',
      iconBg: 'from-amber-400 to-orange-500 shadow-amber-500/50',
      accent: 'text-amber-300',
      border: 'hover:border-amber-400/50',
      grad: 'from-amber-500/[0.10] via-slate-950/95 to-orange-500/[0.04]',
      shadow: 'hover:shadow-amber-500/30',
    },
    violet: {
      glow: 'from-violet-500/40 via-fuchsia-500/20 to-transparent',
      iconBg: 'from-violet-500 to-fuchsia-600 shadow-violet-500/50',
      accent: 'text-violet-300',
      border: 'hover:border-violet-400/50',
      grad: 'from-violet-500/[0.10] via-slate-950/95 to-fuchsia-500/[0.04]',
      shadow: 'hover:shadow-violet-500/30',
    },
  };
  const a = accents[accent] || accents.cyan;
  return (
    <div
      className={`${CARD} ${a.border} ${a.shadow} group bg-gradient-to-br ${a.grad} p-5 hover:-translate-y-1.5 hover:shadow-2xl`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${a.glow} opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${a.iconBg} opacity-70`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${a.accent}`}
          >
            <span className="h-1 w-1 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            {label}
          </div>
          <div className="mt-3 bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-[34px]">
            {value}
          </div>
          {detail && (
            <div className="mt-1.5 text-[11px] font-medium text-slate-400">{detail}</div>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${a.iconBg} text-white shadow-lg ring-1 ring-inset ring-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}
        >
          {icon}
        </div>
      </div>
      {trend && (
        <div className="relative mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
          <TrendingUp size={11} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const esc = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-[#0b1729] via-slate-950 to-[#0b1729] text-slate-100 shadow-[0_35px_80px_-20px_rgba(34,211,238,0.25)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-gradient-to-r from-cyan-500/[0.08] to-transparent px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/40">
              <Sparkles size={14} />
            </div>
            <h2 className="text-base font-bold tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className={BTN.ghost}>
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon, action }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-transparent px-5 py-4">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-500/10 text-cyan-300 shadow-lg shadow-cyan-500/20 ring-1 ring-inset ring-cyan-500/30">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function OverviewTab({ stats, onNavigateTab }) {
  if (!stats) return <Loader />;
  const inactive = stats.disabledUsers ?? (stats.totalUsers - stats.activeUsers);
  const activityData =
    stats.categories?.slice(0, 6).map(c => ({ name: c.name, uses: c.uses })) || [];

  const pieData =
    stats.categories?.slice(0, 8).map((c, i) => ({
      name: c.name,
      value: c.uses,
      fill: PALETTE[i % PALETTE.length],
    })) || [];

  const totalUses = pieData.reduce((sum, d) => sum + d.value, 0);

  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={800}
        style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          detail="All registered accounts"
          icon={<Users size={22} />}
          accent="cyan"
        />
        <StatCard
          label="Active Users"
          value={stats.activeUsers}
          detail="Enabled accounts"
          icon={<ShieldCheck size={22} />}
          accent="emerald"
        />
        <StatCard
          label="Inactive Users"
          value={inactive}
          detail="Disabled accounts"
          icon={<UserX size={22} />}
          accent="rose"
        />
        <StatCard
          label="Transactions"
          value={stats.totalTransactions}
          detail="Logged across platform"
          icon={<WalletCards size={22} />}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className={`${CARD} xl:col-span-3`}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-400/25 to-transparent blur-3xl" />
          <SectionHeader
            title="Category Usage"
            subtitle="Usage count across all students"
            icon={<BarChart3 size={16} />}
          />
          {activityData.length ? (
            <div className="relative h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ left: 0, right: 12, top: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.08)" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip formatter={v => [`${v} uses`, 'Transactions']} {...TOOLTIP_STYLE} />
                  <Area
                    type="monotone"
                    dataKey="uses"
                    stroke="url(#lineGrad)"
                    strokeWidth={3}
                    fill="url(#areaGrad)"
                    activeDot={{ r: 7, fill: '#22d3ee', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-20 text-center text-sm text-slate-500">No data yet</div>
          )}
        </div>

        <div className={`${CARD} xl:col-span-2`}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-violet-500/25 to-transparent blur-3xl" />
          <SectionHeader title="Category Share" subtitle="Proportional breakdown" />
          {pieData.length ? (
            <div className="relative p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={88}
                      paddingAngle={4}
                      stroke="transparent"
                      strokeWidth={3}
                      labelLine={false}
                      label={renderPieLabel}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, name) => {
                        const pct = totalUses ? Math.round((v / totalUses) * 100) : 0;
                        return [`${v} uses (${pct}%)`, name];
                      }}
                      {...TOOLTIP_STYLE}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-1.5">
                {pieData.map((d, i) => {
                  const pct = totalUses ? Math.round((d.value / totalUses) * 100) : 0;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-xs transition-all duration-300 hover:bg-white/[0.05]"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-slate-900"
                          style={{
                            backgroundColor: d.fill,
                            boxShadow: `0 0 10px ${d.fill}`,
                          }}
                        />
                        <span className="truncate font-semibold text-slate-200">{d.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-500">{d.value}</span>
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold tabular-nums text-white shadow-md"
                          style={{ backgroundColor: d.fill, boxShadow: `0 2px 8px ${d.fill}80` }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-sm text-slate-500">No data yet</div>
          )}
        </div>
      </div>

      <div className={CARD}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-3xl" />
        <SectionHeader title="Quick Actions" subtitle="Jump straight into common admin tasks" />
        <div className="relative grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              id: 'users',
              label: 'Manage Users',
              sub: 'Enable, disable, reset',
              icon: <Users size={18} />,
              grad: 'from-cyan-400 to-blue-500',
              shadow: 'shadow-cyan-500/40',
              hover: 'hover:shadow-cyan-500/40 hover:border-cyan-400/50',
            },
            {
              id: 'categories',
              label: 'Manage Categories',
              sub: 'Default expense/income',
              icon: <Tag size={18} />,
              grad: 'from-emerald-400 to-teal-500',
              shadow: 'shadow-emerald-500/40',
              hover: 'hover:shadow-emerald-500/40 hover:border-emerald-400/50',
            },
            {
              id: 'announcements',
              label: 'Manage Announcements',
              sub: 'System-wide notices',
              icon: <Megaphone size={18} />,
              grad: 'from-amber-400 to-orange-500',
              shadow: 'shadow-amber-500/40',
              hover: 'hover:shadow-amber-500/40 hover:border-amber-400/50',
            },
            {
              id: 'tips',
              label: 'Manage Tips',
              sub: 'Student saving tips',
              icon: <BookOpen size={18} />,
              grad: 'from-rose-500 to-pink-600',
              shadow: 'shadow-rose-500/40',
              hover: 'hover:shadow-rose-500/40 hover:border-rose-400/50',
            },
          ].map(a => (
            <button
              key={a.id}
              onClick={() => onNavigateTab(a.id)}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] px-4 py-3.5 text-left backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${a.hover}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.grad} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08]`}
              />
              <span
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${a.grad} text-white shadow-lg ${a.shadow} ring-1 ring-inset ring-white/20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}
              >
                {a.icon}
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-slate-100">{a.label}</span>
                <span className="mt-0.5 block truncate text-[11px] font-medium text-slate-400">
                  {a.sub}
                </span>
              </span>
              <ArrowUpRight
                size={15}
                className="relative shrink-0 text-slate-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserDetailModal({ user, onClose, onRefresh }) {
  if (!user) return null;

  const isActive = checkIsActive(user);

  const resetAccount = async () => {
    const userId = getUserId(user);
    if (!userId) {
      notifyError('Reset failed', 'This user does not have a valid ID.');
      return;
    }
    const ok = await confirmDialog(
      'Reset this account?',
      `This will make ${user.name}'s account inactive. Financial data will be preserved.`
    );
    if (!ok) return;
    try {
      await api.post(`/admin/users/${userId}/reset`);
      notifySuccess('Account reset', `${user.name}'s account is now inactive.`);
      onRefresh();
      onClose();
    } catch (x) {
      notifyError('Reset failed', x.message);
    }
  };

  const toggleActive = async () => {
    const userId = getUserId(user);
    if (!userId) {
      notifyError('Failed to update account', 'This user does not have a valid ID.');
      return;
    }
    const action = isActive ? 'disable' : 'enable';
    const ok = await confirmDialog(
      `${action === 'disable' ? 'Disable' : 'Enable'} account?`,
      `This will ${action} ${user.name}'s access to Campus Coin student features.`
    );
    if (!ok) return;
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !isActive });
      notifySuccess(`Account ${action}d`, `${user.name}'s account has been ${action}d.`);
      onRefresh();
      onClose();
    } catch (x) {
      notifyError('Failed to update account', x.message);
    }
  };

  const rows = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
    {
      label: 'Status',
      value: (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
            isActive
              ? 'bg-emerald-500/20 text-emerald-200 ring-1 ring-inset ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
              : 'bg-rose-500/20 text-rose-200 ring-1 ring-inset ring-rose-500/40 shadow-lg shadow-rose-500/20'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive
                ? 'bg-emerald-400 shadow-[0_0_8px_currentColor]'
                : 'bg-rose-400 shadow-[0_0_8px_currentColor]'
            }`}
          />
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { label: 'Joined', value: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A' },
    ...(user.lastLogin
      ? [{ label: 'Last login', value: new Date(user.lastLogin).toLocaleString() }]
      : []),
  ];

  return (
    <Modal title="User account" onClose={onClose}>
      <div className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {r.label}
            </span>
            <span className="text-right font-semibold text-slate-100">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {user.role !== 'admin' && (
          <>
            <button className={BTN.reset} onClick={resetAccount}>
              <RotateCcw size={13} /> Reset account
            </button>
            <button className={isActive ? BTN.disable : BTN.enable} onClick={toggleActive}>
              {isActive ? 'Disable' : 'Enable'}
            </button>
          </>
        )}
        <button className={BTN.secondary} onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}

function UsersTab({ users, onRefresh }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  const pageSize = 5;

  const sort = key => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ k }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : null;

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      return (
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va = a[sortKey] ?? '';
      let vb = b[sortKey] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedUsers = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggle = async u => {
    const userId = getUserId(u);
    if (!userId) {
      notifyError('Failed to update account', 'This user does not have a valid ID.');
      return;
    }
    const isActive = checkIsActive(u);
    const action = isActive ? 'disable' : 'enable';
    const ok = await confirmDialog(
      `${isActive ? 'Disable' : 'Enable'} account?`,
      `This will ${action} ${u.name}'s access to Campus Coin.`
    );
    if (!ok) return;
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !isActive });
      notifySuccess(`Account ${action}d`, `${u.name}'s account has been ${action}d.`);
      onRefresh();
    } catch (x) {
      notifyError('Failed to update account', x.message);
    }
  };

  const reset = async u => {
    const userId = getUserId(u);
    if (!userId) {
      notifyError('Reset failed', 'This user does not have a valid ID.');
      return;
    }
    const ok = await confirmDialog(
      'Reset this account?',
      `This will make ${u.name}'s account inactive. Financial data will be preserved.`
    );
    if (!ok) return;
    try {
      await api.post(`/admin/users/${userId}/reset`);
      notifySuccess('Account reset', `${u.name}'s account is now inactive.`);
      onRefresh();
    } catch (x) {
      notifyError('Reset failed', x.message);
    }
  };

  const downloadCSV = () => {
    if (!filtered.length) return;
    const headers = ['ID', 'Name', 'Email', 'Role', 'Joined Date'];
    const rows = filtered.map(u => [
      getUserId(u) || '',
      `"${String(u.name || '').replace(/"/g, '""')}"`,
      `"${String(u.email || '').replace(/"/g, '""')}"`,
      u.role || '',
      u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'CampusCoin_Users_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    if (!filtered.length) return;
    let table =
      '<table border="1"><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>';
    filtered.forEach(u => {
      table += `
        <tr>
          <td>${getUserId(u) || ''}</td>
          <td>${u.name || ''}</td>
          <td>${u.email || ''}</td>
          <td>${u.role || ''}</td>
          <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
        </tr>
      `;
    });
    table += '</table>';
    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CampusCoin_Users_Report.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const rows = filtered
      .map(
        u => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${u.name || ''}</td>
          <td style="padding:8px;border:1px solid #ddd;">${u.email || ''}</td>
          <td style="padding:8px;border:1px solid #ddd;">${u.role || ''}</td>
          <td style="padding:8px;border:1px solid #ddd;">${
            u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''
          }</td>
        </tr>
      `
      )
      .join('');
    printWindow.document.write(`
      <html><head><title>Campus Coin - Users Report</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; color: #1e293b; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        p { font-size: 13px; color: #64748b; margin-top: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
        th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #ddd; }
      </style></head>
      <body>
        <h1>Campus Coin — Registered Users Report</h1>
        <p>Export Date: ${new Date().toLocaleString()}</p>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            className={`${FIELD} pl-10`}
            placeholder="Search by name or email..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className={BTN.emerald} onClick={downloadCSV} title="Export CSV">
            <FileText size={14} /> CSV
          </button>
          <button className={BTN.rose} onClick={downloadPDF} title="Export PDF">
            <Printer size={14} /> PDF
          </button>
          <button className={BTN.violet} onClick={downloadExcel} title="Export Excel">
            <FileSpreadsheet size={14} /> Excel
          </button>
          <span className="rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3.5 py-2 text-xs font-bold tabular-nums text-cyan-200 ring-1 ring-inset ring-cyan-500/30 shadow-lg shadow-cyan-500/10">
            {filtered.length} / {users.length}
          </span>
        </div>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl" />
        <div className="relative overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-gradient-to-r from-cyan-500/[0.08] via-blue-500/[0.04] to-transparent">
                <th
                  className="cursor-pointer px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-colors hover:text-cyan-100"
                  onClick={() => sort('name')}
                >
                  <span className="inline-flex items-center gap-1">
                    Name <SortIcon k="name" />
                  </span>
                </th>
                <th
                  className="cursor-pointer px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-colors hover:text-cyan-100"
                  onClick={() => sort('email')}
                >
                  <span className="inline-flex items-center gap-1">
                    Email <SortIcon k="email" />
                  </span>
                </th>
                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Role
                </th>
                <th
                  className="cursor-pointer px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-colors hover:text-cyan-100"
                  onClick={() => sort('createdAt')}
                >
                  <span className="inline-flex items-center gap-1">
                    Joined <SortIcon k="createdAt" />
                  </span>
                </th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {paginatedUsers.map((u, idx) => {
                const userId = getUserId(u);
                const isActive = checkIsActive(u);
                const grads = [
                  'from-cyan-400 to-blue-500',
                  'from-violet-500 to-fuchsia-600',
                  'from-emerald-400 to-teal-500',
                  'from-amber-400 to-orange-500',
                  'from-rose-500 to-pink-600',
                ];
                const g = grads[idx % grads.length];
                return (
                  <tr
                    key={userId || u.email || u.name}
                    className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/[0.05] hover:to-transparent"
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${g} text-[11px] font-bold text-white shadow-lg ring-1 ring-inset ring-white/20 transition-transform duration-500 group-hover:scale-110`}
                        >
                          {(u.name || 'U')
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                          u.role === 'admin'
                            ? 'bg-gradient-to-r from-fuchsia-500/25 to-purple-500/25 text-fuchsia-200 ring-fuchsia-500/40 shadow-lg shadow-fuchsia-500/20'
                            : 'bg-white/[0.05] text-slate-300 ring-white/[0.1]'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          className={BTN.ghost}
                          onClick={() => setViewing(u)}
                          title="View account"
                        >
                          <Eye size={14} />
                        </button>
                        {u.role !== 'admin' ? (
                          <>
                            <button
                              className={BTN.reset}
                              onClick={() => reset(u)}
                              disabled={!userId}
                              title="Reset account"
                            >
                              <RotateCcw size={12} /> Reset
                            </button>
                            <button
                              className={isActive ? BTN.disable : BTN.enable}
                              onClick={() => toggle(u)}
                              disabled={!userId}
                            >
                              {isActive ? 'Disable' : 'Enable'}
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-fuchsia-500/25 to-purple-500/25 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-fuchsia-200 ring-1 ring-inset ring-fuchsia-500/40">
                            <Shield size={10} /> Protected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!paginatedUsers.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-slate-500">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-gradient-to-r from-white/[0.02] to-transparent px-5 py-3.5">
            <span className="text-xs font-medium text-slate-400">
              Page <span className="font-bold text-cyan-300">{page}</span> of{' '}
              <span className="font-bold text-cyan-300">{totalPages}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                className={BTN.secondary}
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                className={BTN.secondary}
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {viewing && (
        <UserDetailModal user={viewing} onClose={() => setViewing(null)} onRefresh={onRefresh} />
      )}
    </div>
  );
}

function CategoriesTab({ endpoint = '/admin/categories' }) {
  const [categoryType, setCategoryType] = useState('expense');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get(endpoint)
      .then(x => setItems(x.items ?? x))
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [endpoint]);

  const filteredCategories = items.filter(c => (c.type || 'expense') === categoryType);

  const remove = async item => {
    const ok = await confirmDialog(
      'Delete this default category?',
      'Students will no longer see this category. This cannot be undone.'
    );
    if (!ok) return;
    try {
      await api.delete(`${endpoint}/${item._id}`);
      notifySuccess('Category deleted');
      load();
    } catch (x) {
      notifyError('Could not delete category', x.message);
    }
  };

  const save = async (data, id) => {
    const payload = { ...data, isDefault: true };
    try {
      if (id) {
        await api.put(`${endpoint}/${id}`, payload);
        notifySuccess('Category updated');
      } else {
        await api.post(endpoint, payload);
        notifySuccess('Category created');
      }
      setEditing(null);
      load();
    } catch (x) {
      notifyError('Could not save category', x.message);
      throw x;
    }
  };

  return (
    <div className="space-y-4">
      <ErrorBox error={error} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-1.5 shadow-lg shadow-black/30 backdrop-blur">
          {['expense', 'income'].map(t => {
            const isActive = categoryType === t;
            const grad =
              t === 'expense'
                ? 'from-rose-500 to-pink-600 shadow-rose-500/40'
                : 'from-emerald-400 to-teal-500 shadow-emerald-500/40';
            return (
              <button
                key={t}
                className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${grad} text-white shadow-lg ring-1 ring-inset ring-white/20`
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-cyan-300'
                }`}
                onClick={() => setCategoryType(t)}
              >
                {t}
              </button>
            );
          })}
        </div>

        <button className={BTN.primary} onClick={() => setEditing('new')}>
          <Plus size={15} /> Add {categoryType} category
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className={`${CARD} overflow-hidden`}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl" />
          <div className="relative overflow-x-auto">
            <table className="min-w-[560px] w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-gradient-to-r from-cyan-500/[0.08] via-blue-500/[0.04] to-transparent">
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Name
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Icon
                  </th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Default
                  </th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredCategories.map((c, i) => {
                  const grads = [
                    'from-cyan-400 to-blue-500',
                    'from-violet-500 to-fuchsia-600',
                    'from-emerald-400 to-teal-500',
                    'from-amber-400 to-orange-500',
                    'from-rose-500 to-pink-600',
                  ];
                  const g = grads[i % grads.length];
                  return (
                    <tr
                      key={c._id}
                      className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/[0.05] hover:to-transparent"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${g} text-lg shadow-lg ring-1 ring-inset ring-white/20 transition-transform duration-500 group-hover:scale-110`}
                          >
                            {c.icon || '📁'}
                          </div>
                          <span className="font-semibold text-slate-100">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-lg">{c.icon || '—'}</td>
                      <td className="px-5 py-4">
                        {c.isDefault ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 ring-1 ring-inset ring-emerald-500/40 shadow-lg shadow-emerald-500/20">
                            <Check size={10} /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className={BTN.ghost}
                            onClick={() => setEditing(c)}
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-rose-500/20 hover:text-rose-300"
                            onClick={() => remove(c)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredCategories.length && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center text-sm text-slate-500">
                      No {categoryType} categories defined yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? `Add ${categoryType} category` : 'Edit category'}
          onClose={() => setEditing(null)}
        >
          <CategoryForm
            initial={editing === 'new' ? { type: categoryType } : editing}
            defaultType={categoryType}
            onSave={save}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

function CategoryForm({ initial, defaultType, onSave, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    type: initial?.type ?? defaultType ?? 'expense',
    icon: initial?.icon ?? '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      await onSave(form, initial?._id);
    } catch {
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
          Name
        </label>
        <input
          className={`${FIELD} ${
            errors.name ? 'border-rose-400/60 focus:border-rose-500 focus:ring-rose-500/20' : ''
          }`}
          value={form.name}
          placeholder="e.g. Food & Dining"
          onChange={e => {
            setForm(x => ({ ...x, name: e.target.value }));
            setErrors({});
          }}
        />
        {errors.name && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-400">
            <AlertCircle size={12} /> {errors.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
            Type
          </label>
          <select
            className={FIELD}
            value={form.type}
            onChange={e => setForm(x => ({ ...x, type: e.target.value }))}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
            Icon (emoji or text)
          </label>
          <input
            className={FIELD}
            value={form.icon}
            placeholder="e.g. 🍔"
            onChange={e => setForm(x => ({ ...x, icon: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
        <button type="button" className={BTN.secondary} onClick={onClose}>
          Cancel
        </button>
        <button className={BTN.primary} disabled={busy}>
          {busy ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function CrudTab({ endpoint, columns, FormComponent, entityLabel }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get(endpoint)
      .then(x => setItems(x.items ?? x))
      .catch(x => setError(x.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [endpoint]);

  const remove = async item => {
    const ok = await confirmDialog(
      `Delete this ${entityLabel}?`,
      'This action cannot be undone. It will be removed from the Student Web immediately.'
    );
    if (!ok) return;
    try {
      await api.delete(`${endpoint}/${item._id}`);
      notifySuccess(`${entityLabel} deleted`);
      load();
    } catch (x) {
      notifyError(`Could not delete ${entityLabel}`, x.message);
    }
  };

  const save = async (data, id) => {
    try {
      if (id) {
        await api.put(`${endpoint}/${id}`, data);
        notifySuccess(`${entityLabel} updated`);
      } else {
        await api.post(endpoint, data);
        notifySuccess(`${entityLabel} created`);
      }
      setEditing(null);
      load();
    } catch (x) {
      notifyError(`Could not save ${entityLabel}`, x.message);
      throw x;
    }
  };

  return (
    <div className="space-y-4">
      <ErrorBox error={error} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-cyan-200 ring-1 ring-inset ring-cyan-500/30 shadow-lg shadow-cyan-500/10">
          <span className="text-base font-bold tabular-nums text-cyan-100">{items.length}</span>
          {entityLabel}(s)
        </span>
        <button className={BTN.primary} onClick={() => setEditing('new')}>
          <Plus size={15} /> Add {entityLabel}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className={`${CARD} overflow-hidden`}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-3xl" />
          <div className="relative overflow-x-auto">
            <table className="min-w-[620px] w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-gradient-to-r from-cyan-500/[0.08] via-blue-500/[0.04] to-transparent">
                  {columns.map(c => (
                    <th
                      key={c.key}
                      className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300"
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {items.map(item => (
                  <tr
                    key={item._id}
                    className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/[0.05] hover:to-transparent"
                  >
                    {columns.map(c => (
                      <td key={c.key} className="px-5 py-4 text-slate-200">
                        {c.render ? c.render(item[c.key], item) : String(item[c.key] ?? '—')}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className={BTN.ghost}
                          onClick={() => setEditing(item)}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-rose-500/20 hover:text-rose-300"
                          onClick={() => remove(item)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-5 py-16 text-center text-sm text-slate-500"
                    >
                      No {entityLabel}s yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <Modal
          title={editing === 'new' ? `New ${entityLabel}` : `Edit ${entityLabel}`}
          onClose={() => setEditing(null)}
        >
          <FormComponent
            initial={editing === 'new' ? null : editing}
            onSave={save}
            onClose={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

function AnnouncementForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    message: initial?.message ?? '',
    status: initial?.status ?? 'active',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.message.trim()) errs.message = 'Message is required.';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      await onSave(form, initial?._id);
    } catch {
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
          Title
        </label>
        <input
          className={`${FIELD} ${errors.title ? 'border-rose-400/60' : ''}`}
          value={form.title}
          placeholder="Announcement title"
          onChange={e => {
            setForm(x => ({ ...x, title: e.target.value }));
            setErrors(p => ({ ...p, title: '' }));
          }}
        />
        {errors.title && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-400">
            <AlertCircle size={12} /> {errors.title}
          </span>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
          Message
        </label>
        <textarea
          className={`${FIELD} resize-y ${errors.message ? 'border-rose-400/60' : ''}`}
          rows={4}
          value={form.message}
          placeholder="Write announcement details..."
          onChange={e => {
            setForm(x => ({ ...x, message: e.target.value }));
            setErrors(p => ({ ...p, message: '' }));
          }}
        />
        {errors.message && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-400">
            <AlertCircle size={12} /> {errors.message}
          </span>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
          Status
        </label>
        <select
          className={FIELD}
          value={form.status}
          onChange={e => setForm(x => ({ ...x, status: e.target.value }))}
        >
          <option value="active">Active (visible to students)</option>
          <option value="inactive">Inactive (hidden)</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
        <button type="button" className={BTN.secondary} onClick={onClose}>
          Cancel
        </button>
        <button className={BTN.primary} disabled={busy}>
          {busy ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function TipForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    content: initial?.content ?? initial?.description ?? '',
    priority: initial?.priority ?? 5,
    isActive: initial?.isActive ?? initial?.status !== 'inactive',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.content.trim()) errs.content = 'Content is required.';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      await onSave(
        {
          title: form.title.trim(),
          content: form.content.trim(),
          description: form.content.trim(),
          priority: Number(form.priority) || 5,
          isActive: !!form.isActive,
          status: form.isActive ? 'active' : 'inactive',
        },
        initial?._id
      );
    } catch {
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
          Title
        </label>
        <input
          className={`${FIELD} ${errors.title ? 'border-rose-400/60' : ''}`}
          value={form.title}
          placeholder="Tip title"
          onChange={e => {
            setForm(x => ({ ...x, title: e.target.value }));
            setErrors(p => ({ ...p, title: '' }));
          }}
        />
        {errors.title && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-400">
            <AlertCircle size={12} /> {errors.title}
          </span>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
          Content / Tip text
        </label>
        <textarea
          className={`${FIELD} resize-y ${errors.content ? 'border-rose-400/60' : ''}`}
          rows={3}
          value={form.content}
          placeholder="Tip description..."
          onChange={e => {
            setForm(x => ({ ...x, content: e.target.value }));
            setErrors(p => ({ ...p, content: '' }));
          }}
        />
        {errors.content && (
          <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-400">
            <AlertCircle size={12} /> {errors.content}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300">
            Priority (1 = highest)
          </label>
          <input
            className={FIELD}
            type="number"
            min={1}
            max={10}
            value={form.priority}
            onChange={e => setForm(x => ({ ...x, priority: Number(e.target.value) }))}
          />
        </div>

        <div className="flex items-end">
          <label className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-white/[0.1] bg-slate-950/70 px-3.5 py-3 text-sm font-medium text-slate-200 shadow-inner shadow-black/30 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/[0.08]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-2 focus:ring-cyan-400/40"
              checked={form.isActive}
              onChange={e => setForm(x => ({ ...x, isActive: e.target.checked }))}
            />
            Active on Student Web
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
        <button type="button" className={BTN.secondary} onClick={onClose}>
          Cancel
        </button>
        <button className={BTN.primary} disabled={busy}>
          {busy ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    grad: 'from-cyan-400 via-blue-500 to-indigo-500',
    shadow: 'shadow-cyan-500/40',
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    grad: 'from-violet-500 to-fuchsia-600',
    shadow: 'shadow-violet-500/40',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: Tag,
    grad: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-500/40',
  },
  {
    id: 'announcements',
    label: 'Announcements',
    icon: Megaphone,
    grad: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-500/40',
  },
  {
    id: 'tips',
    label: 'Saving Tips',
    icon: BookOpen,
    grad: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-500/40',
  },
];

export function Admin() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setError('');
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([s, u]) => {
        setStats(s.data ?? s);
        const userData = u.items ?? u.users ?? u.data?.users ?? u.data ?? u;
        setUsers(Array.isArray(userData) ? userData : []);
      })
      .catch(x => setError(x.message));
  }, [refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);
  const setTab = t => setSearchParams({ tab: t });

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />

      <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-white shadow-xl shadow-cyan-500/50 ring-1 ring-inset ring-white/20 transition-transform duration-500 hover:scale-110 hover:-rotate-3">
              <ShieldCheck size={24} />
              <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0b1729] bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white via-cyan-100 to-slate-300 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
                Hello, {user?.name || 'Administrator'}
              </h1>
              <p className="text-xs font-medium text-slate-400">
                Admin Control Panel · Manage users, categories, announcements and saving tips
              </p>
            </div>
          </div>
        </div>

        <button className={BTN.secondary} onClick={refresh} title="Refresh all data">
          <RefreshCw size={14} className="transition-transform duration-500 group-hover:rotate-180" />{' '}
          Refresh
        </button>
      </div>

      <div className="relative mb-6 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex min-w-full gap-2 rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-2 shadow-xl shadow-black/40 backdrop-blur-xl sm:min-w-0">
          {TABS.map(t => {
            const active = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`group relative inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 sm:flex-none ${
                  active
                    ? `bg-gradient-to-r ${t.grad} text-white shadow-lg ${t.shadow} ring-1 ring-inset ring-white/20 scale-[1.03]`
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white hover:scale-[1.02]'
                }`}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2.5 : 2}
                  className={`transition-transform duration-300 ${
                    active ? 'drop-shadow-sm' : 'group-hover:scale-110'
                  }`}
                />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <ErrorBox error={error} />

        {activeTab === 'overview' && <OverviewTab stats={stats} onNavigateTab={setTab} />}
        {activeTab === 'users' && <UsersTab users={users} onRefresh={refresh} />}
        {activeTab === 'categories' && <CategoriesTab endpoint="/admin/categories" />}

        {activeTab === 'announcements' && (
          <CrudTab
            endpoint="/admin/announcements"
            entityLabel="announcement"
            FormComponent={AnnouncementForm}
            columns={[
              { key: 'title', label: 'Title' },
              {
                key: 'message',
                label: 'Message',
                render: v => (
                  <span className="text-xs text-slate-400">
                    {String(v ?? '').slice(0, 80)}
                    {(v?.length ?? 0) > 80 ? '...' : ''}
                  </span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: v => (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                      v === 'active'
                        ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
                        : 'bg-white/[0.05] text-slate-300 ring-white/[0.1]'
                    }`}
                  >
                    {v}
                  </span>
                ),
              },
            ]}
          />
        )}

        {activeTab === 'tips' && (
          <CrudTab
            endpoint="/admin/tip-templates"
            entityLabel="tip template"
            FormComponent={TipForm}
            columns={[
              { key: 'title', label: 'Title' },
              {
                key: 'content',
                label: 'Content',
                render: (v, item) => (
                  <span className="text-xs text-slate-400">
                    {String(v ?? item?.description ?? '').slice(0, 80)}
                    {((v ?? item?.description)?.length ?? 0) > 80 ? '...' : ''}
                  </span>
                ),
              },
              {
                key: 'priority',
                label: 'Priority',
                render: v => (
                  <span className="inline-flex items-center rounded-md bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-200 ring-1 ring-inset ring-violet-500/40">
                    P{v ?? 5}
                  </span>
                ),
              },
              {
                key: 'isActive',
                label: 'Active',
                render: (v, item) => {
                  const active = v !== false && item?.status !== 'inactive';
                  return active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 ring-1 ring-inset ring-emerald-500/40 shadow-lg shadow-emerald-500/20">
                      <Check size={10} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ring-1 ring-inset ring-white/[0.1]">
                      Off
                    </span>
                  );
                },
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
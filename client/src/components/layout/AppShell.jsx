import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Bot,
  BrainCircuit,
  ChartNoAxesCombined,
  ChevronRight,
  CircleUserRound,
  LayoutDashboard,
  Menu,
  ReceiptText,
  ScanLine,
  Target,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Logo } from '../common/Logo.jsx';
import { confirmDialog, notifySuccess } from '../../utils/swal.js';

const studentNavGroups = [
  {
    label: 'Overview',
    items: [['/dashboard', 'Dashboard', LayoutDashboard, 'cyan']],
  },
  {
    label: 'Money',
    items: [
      ['/transactions', 'Transactions', ReceiptText, 'emerald'],
      ['/budgets', 'Budgets', Target, 'amber'],
    ],
  },
  {
    label: 'Analytics',
    items: [
      ['/reports', 'Analytics & Reports', ChartNoAxesCombined, 'violet'],
      ['/insights', 'AI Insights', BrainCircuit, 'fuchsia'],
      ['/assistant', 'AI Assistant', Bot, 'blue'],
    ],
  },
  {
    label: 'Tools',
    items: [['/ocr', 'Scan Receipt', ScanLine, 'rose']],
  },
  {
    label: 'Account',
    items: [['/profile', 'Profile', CircleUserRound, 'indigo']],
  },
];

const adminNavGroups = [
  {
    label: 'Administration',
    items: [['/admin', 'Admin Panel', LayoutDashboard, 'cyan']],
  },
  {
    label: 'Account',
    items: [['/profile', 'Profile', CircleUserRound, 'indigo']],
  },
];

const toneStyles = {
  cyan: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-cyan-400',
    icon: 'text-cyan-500',
    hoverIcon: 'group-hover:text-cyan-300',
    dot: 'bg-cyan-400',
  },
  emerald: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-emerald-400',
    icon: 'text-emerald-500',
    hoverIcon: 'group-hover:text-emerald-300',
    dot: 'bg-emerald-400',
  },
  amber: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-amber-400',
    icon: 'text-amber-500',
    hoverIcon: 'group-hover:text-amber-300',
    dot: 'bg-amber-400',
  },
  violet: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-violet-400',
    icon: 'text-violet-500',
    hoverIcon: 'group-hover:text-violet-300',
    dot: 'bg-violet-400',
  },
  fuchsia: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-fuchsia-400',
    icon: 'text-fuchsia-500',
    hoverIcon: 'group-hover:text-fuchsia-300',
    dot: 'bg-fuchsia-400',
  },
  blue: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-blue-400',
    icon: 'text-blue-500',
    hoverIcon: 'group-hover:text-blue-300',
    dot: 'bg-blue-400',
  },
  rose: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-rose-400',
    icon: 'text-rose-500',
    hoverIcon: 'group-hover:text-rose-300',
    dot: 'bg-rose-400',
  },
  indigo: {
    active: 'bg-slate-800 text-white dark:bg-slate-800/80 dark:text-indigo-400',
    icon: 'text-indigo-500',
    hoverIcon: 'group-hover:text-indigo-300',
    dot: 'bg-indigo-400',
  },
};

export function AppShell() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const loc = useLocation();
  const nav = useNavigate();

  const isAdmin = user?.role === 'admin';
  const navGroups = isAdmin ? adminNavGroups : studentNavGroups;
  const allNavItems = navGroups.flatMap(group => group.items);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const close = () => setOpen(false);

  const handleSignOut = async () => {
    const confirmed = await confirmDialog({
      title: 'Sign out of Campus Coin?',
      text: 'Your current session will be closed.',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel',
      icon: 'question',
    });

    if (confirmed) {
      await signOut();
      notifySuccess('Signed out successfully.');
      nav('/', { replace: true });
    }
  };

  const getBreadcrumbParts = () => {
    if (loc.pathname.startsWith('/admin')) {
      const queryParams = new URLSearchParams(loc.search);
      const activeTab = queryParams.get('tab') || 'overview';

      const tabNames = {
        overview: 'Overview',
        users: 'Manage Users',
        categories: 'Manage Categories',
        announcements: 'Manage Announcements',
        tips: 'Manage Tip Templates',
      };

      return [
        { label: 'Admin', path: '/admin' },
        {
          label: tabNames[activeTab] || 'Control Panel',
          path: `/admin${loc.search}`,
        },
      ];
    }

    if (loc.pathname === '/dashboard') {
      return [{ label: 'Dashboard', path: '/dashboard' }];
    }

    const active = allNavItems.find(item => item[0] === loc.pathname);

    return [
      { label: 'Dashboard', path: '/dashboard' },
      {
        label: active ? active[1] : 'Workspace',
        path: loc.pathname,
      },
    ];
  };

  const breadcrumbs = getBreadcrumbParts();

  const handleSidebarToggle = () => {
    if (window.innerWidth < 768) {
      setOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  const initials =
    user?.name
      ?.split(' ')
      .map(item => item[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CC';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0B1120] dark:text-white">
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={close}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden
          border-r border-slate-200 bg-white
          transition-[width,transform] duration-300 ease-out
          dark:border-slate-800 dark:bg-[#0F172A]
          ${collapsed ? 'w-[84px]' : 'w-[272px]'}
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="relative flex h-[76px] shrink-0 items-center justify-center border-b border-slate-200 px-4 dark:border-slate-800">
          <Logo collapsed={collapsed} height={collapsed ? 32 : 44} />
        </div>

        <div
          className={`
            relative mx-3 mt-5 mb-2 flex items-center gap-3 rounded-2xl
            border border-slate-200 bg-slate-50 p-3
            transition-all duration-300
            dark:border-slate-800 dark:bg-[#1E293B]/50
            ${collapsed ? 'justify-center p-2' : ''}
          `}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isAdmin
                ? 'bg-fuchsia-600 text-white'
                : 'bg-cyan-600 text-white'
            }`}
          >
            {isAdmin ? <LayoutDashboard size={18} /> : <CircleUserRound size={18} />}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-slate-800 dark:text-white">
                {user?.name || 'Campus Coin User'}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAdmin ? 'bg-fuchsia-500' : 'bg-cyan-500'
                  }`}
                />
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'text-fuchsia-600 dark:text-fuchsia-400'
                      : 'text-cyan-600 dark:text-cyan-400'
                  }`}
                >
                  {isAdmin ? 'Administrator' : 'Student'}
                </p>
              </div>
            </div>
          )}
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/40 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700/50">
          {navGroups.map(group => (
            <div key={group.label} className="mb-5">
              {!collapsed && (
                <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  {group.label}
                </p>
              )}
              <div className="space-y-1.5">
                {group.items.map(([to, label, Icon, tone = 'cyan']) => {
                  const t = toneStyles[tone] || toneStyles.cyan;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === '/admin' || to === '/dashboard'}
                      onClick={close}
                      title={collapsed ? label : undefined}
                      className={({ isActive }) => `
                        group relative flex h-11 items-center rounded-xl text-[13px] font-semibold
                        transition-all duration-300 ease-out
                        ${collapsed ? 'justify-center' : 'gap-3 px-3'}
                        ${
                          isActive
                            ? `${t.active}`
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={`shrink-0 transition-all duration-300 ${
                              isActive
                                ? 'text-current'
                                : `${t.icon} ${t.hoverIcon}`
                            }`}
                          />
                          {!collapsed && (
                            <span className="truncate">{label}</span>
                          )}
                          {!collapsed && isActive && (
                            <ChevronRight
                              size={14}
                              className="ml-auto text-current opacity-70"
                            />
                          )}
                          {collapsed && isActive && (
                            <span className="absolute -right-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-current" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? 'Sign out' : undefined}
            className={`
              flex h-11 w-full items-center rounded-xl text-[13px] font-semibold
              text-slate-500 transition-all duration-300
              hover:bg-slate-100 hover:text-rose-600
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400
              ${collapsed ? 'justify-center' : 'gap-3 px-3'}
            `}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <main
        className={`
          min-h-screen transition-[padding] duration-300 ease-out
          ${collapsed ? 'md:pl-[84px]' : 'md:pl-[272px]'}
        `}
      >
        <header className="sticky top-0 z-30 h-[76px] border-b border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-[#0F172A]">
          <div className="relative flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSidebarToggle}
                aria-label="Toggle navigation"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>

              <div className="hidden items-center gap-1.5 text-[13px] font-medium text-slate-500 dark:text-slate-400 sm:flex">
                {breadcrumbs.map((item, index) => (
                  <div key={`${item.path}-${index}`} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight
                        size={14}
                        className="mx-1.5 text-slate-300 dark:text-slate-600"
                      />
                    )}

                    {index === breadcrumbs.length - 1 ? (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-800 dark:bg-slate-800 dark:text-white">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        to={item.path}
                        className="rounded-lg px-2 py-1 font-medium transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <div className="hidden items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 sm:flex dark:border-emerald-400/20">
                <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Live
                </span>
              </div>

              <NavLink
                to="/notifications"
                aria-label="Notifications"
                title="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500">
                  <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/70" />
                </span>
              </NavLink>

              <NavLink
                to="/profile"
                aria-label="Profile"
                title="Profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-[12px] font-bold text-white transition-all duration-300 hover:bg-cyan-500"
              >
                <span className="relative">{initials}</span>
              </NavLink>
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-76px)] px-4 pb-28 pt-6 sm:px-6 sm:pb-10 lg:px-8">
          <div className="mx-auto w-full max-w-[1500px]">
            <Outlet />
          </div>
        </div>
      </main>

      <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl dark:border-slate-700 dark:bg-[#0F172A]/95 md:hidden">
        <div className="flex items-center justify-around">
          {allNavItems.slice(0, 5).map(([to, label, Icon, tone = 'cyan']) => {
            const t = toneStyles[tone] || toneStyles.cyan;
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin' || to === '/dashboard'}
                onClick={close}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-[10px] font-bold transition-all duration-300
                  ${
                    isActive
                      ? `${t.active}`
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="max-w-[60px] truncate">{label.split(' ')[0]}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
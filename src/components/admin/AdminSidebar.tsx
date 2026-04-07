import { Activity, ShieldCheck, X } from 'lucide-react';
import { AdminTab, AdminUserProfile } from '../../types';

export default function AdminSidebar({
  tabs,
  activeTab,
  setActiveTab,
  adminProfile,
  pendingPartners,
  totalUsers,
  sidebarOpen,
  sidebarCollapsed,
  setSidebarOpen,
}: {
  tabs: Array<{ id: AdminTab; label: string; icon: any }>;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  adminProfile: AdminUserProfile | null;
  pendingPartners: number;
  totalUsers: number;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const meta: Record<AdminTab, number> = {
    overview: totalUsers,
    users: totalUsers,
    partners: pendingPartners,
    jobs: 0,
    market: 0,
    feed: 0,
    wallet: 0,
  };

  return (
    <aside
      className={`fixed inset-y-3 left-3 z-40 flex w-[min(88vw,320px)] flex-col rounded-[30px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur transition-transform duration-300 lg:sticky lg:top-6 lg:z-10 lg:h-[calc(100vh-3rem)] lg:w-auto lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'
      } ${sidebarCollapsed ? 'lg:px-3' : 'lg:px-4'}`}
    >
      <div className={`rounded-[26px] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.2),_transparent_28%),linear-gradient(160deg,#020617_0%,#0f172a_46%,#164e63_100%)] p-4 text-white ${sidebarCollapsed ? 'lg:px-3 lg:py-4' : 'lg:p-5'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200">
              <ShieldCheck className="h-4 w-4" />
              {!sidebarCollapsed ? 'Control Room' : 'Admin'}
            </div>
            <h1 className={`mt-4 font-semibold ${sidebarCollapsed ? 'lg:text-lg text-2xl' : 'text-2xl'}`}>Connect Admin</h1>
            {!sidebarCollapsed ? <p className="mt-2 text-sm text-slate-300">Structured to move between moderation, user control, access, and wallet operations quickly.</p> : null}
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-2xl p-2 text-white/80 hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:flex-col lg:text-center' : ''}`}>
          <img src={adminProfile?.photoURL || 'https://placehold.co/80x80'} alt={adminProfile?.displayName || 'Admin'} className="h-12 w-12 rounded-2xl object-cover" />
          {!sidebarCollapsed ? (
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{adminProfile?.displayName || 'Admin user'}</p>
              <p className="truncate text-sm text-slate-500">{adminProfile?.email || 'Signed in'}</p>
            </div>
          ) : (
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-900">Admin</p>
            </div>
          )}
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${sidebarCollapsed ? 'lg:grid-cols-1' : 'grid-cols-2'}`}>
        <SidebarStat label="Users" value={totalUsers} compact={sidebarCollapsed} />
        <SidebarStat label="Pending" value={pendingPartners} compact={sidebarCollapsed} />
      </div>

      <nav className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                active ? 'bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)]' : 'bg-transparent text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              title={sidebarCollapsed ? tab.label : undefined}
            >
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-white/12 text-white' : 'bg-slate-100 text-slate-700'}`}>
                <Icon className="h-4 w-4" />
              </span>
              {!sidebarCollapsed ? (
                <>
                  <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${active ? 'bg-white/12 text-white' : 'bg-slate-200 text-slate-700'}`}>{meta[tab.id] || 0}</span>
                </>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className={`mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
        {!sidebarCollapsed ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Sync status</p>
            <p className="mt-2 text-sm text-slate-600">The admin panel is structured around linked sections so account management stays fast on mobile and desktop.</p>
          </>
        ) : (
          <div className="hidden lg:flex lg:justify-center">
            <Activity className="h-5 w-5 text-slate-500" />
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarStat({ label, value, compact }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white ${compact ? 'px-2 py-3 text-center' : 'px-3 py-3'}`}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{compact ? label.slice(0, 4) : label}</p>
      <p className={`mt-2 font-semibold text-slate-900 ${compact ? 'text-base' : 'text-lg'}`}>{value}</p>
    </div>
  );
}

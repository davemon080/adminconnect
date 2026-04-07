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
      className={`fixed inset-y-2 left-2 z-40 flex w-[min(88vw,304px)] flex-col rounded-[28px] border border-[#dbe3f0] bg-[#ffffff]/96 p-3 shadow-[0_8px_30px_rgba(60,64,67,0.12)] backdrop-blur transition-transform duration-300 lg:sticky lg:top-4 lg:z-10 lg:h-[calc(100vh-2rem)] lg:w-auto lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'
      } ${sidebarCollapsed ? 'lg:px-2.5' : 'lg:px-3'}`}
    >
      <div className={`rounded-[24px] border border-[#d2e3fc] bg-[linear-gradient(180deg,#eef4ff_0%,#e8f0fe_100%)] p-3.5 text-[#174ea6] ${sidebarCollapsed ? 'lg:px-2.5 lg:py-3.5' : 'lg:p-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#1967d2] shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
              <ShieldCheck className="h-4 w-4" />
              {!sidebarCollapsed ? 'Control Room' : 'Admin'}
            </div>
            <h1 className={`mt-3 font-semibold ${sidebarCollapsed ? 'lg:text-base text-xl' : 'text-xl'}`}>Connect Admin</h1>
            {!sidebarCollapsed ? <p className="mt-1.5 text-xs leading-5 text-[#5f6368]">Compact admin workspace with clearer navigation and lighter Google-style surfaces.</p> : null}
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-2xl p-2 text-[#5f6368] hover:bg-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`mt-3 rounded-[22px] border border-[#dbe3f0] bg-[#f8fafd] p-3 ${sidebarCollapsed ? 'lg:px-2.5' : ''}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:flex-col lg:text-center' : ''}`}>
          <img src={adminProfile?.photoURL || 'https://placehold.co/80x80'} alt={adminProfile?.displayName || 'Admin'} className="h-11 w-11 rounded-2xl object-cover" />
          {!sidebarCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#202124]">{adminProfile?.displayName || 'Admin user'}</p>
              <p className="truncate text-xs text-[#5f6368]">{adminProfile?.email || 'Signed in'}</p>
            </div>
          ) : (
            <div className="hidden lg:block">
              <p className="text-[11px] font-semibold text-[#202124]">Admin</p>
            </div>
          )}
        </div>
      </div>

      <div className={`mt-3 grid gap-2.5 ${sidebarCollapsed ? 'lg:grid-cols-1' : 'grid-cols-2'}`}>
        <SidebarStat label="Users" value={totalUsers} compact={sidebarCollapsed} />
        <SidebarStat label="Pending" value={pendingPartners} compact={sidebarCollapsed} />
      </div>

      <nav className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
                active ? 'bg-[#1a73e8] text-white shadow-[0_8px_20px_rgba(26,115,232,0.22)]' : 'bg-transparent text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              title={sidebarCollapsed ? tab.label : undefined}
            >
              <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-white/16 text-white' : 'bg-[#e8f0fe] text-[#1967d2]'}`}>
                <Icon className="h-4 w-4" />
              </span>
              {!sidebarCollapsed ? (
                <>
                  <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${active ? 'bg-white/16 text-white' : 'bg-[#eef3fd] text-[#5f6368]'}`}>{meta[tab.id] || 0}</span>
                </>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className={`mt-3 rounded-[22px] border border-[#dbe3f0] bg-[#f8fafd] p-3 ${sidebarCollapsed ? 'lg:px-2.5' : ''}`}>
        {!sidebarCollapsed ? (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f6368]">Sync status</p>
            <p className="mt-1.5 text-xs leading-5 text-[#5f6368]">Everything is kept compact so the panel stays readable without overflow on smaller screens.</p>
          </>
        ) : (
          <div className="hidden lg:flex lg:justify-center">
            <Activity className="h-5 w-5 text-[#5f6368]" />
          </div>
        )}
      </div>
    </aside>
  );
}

function SidebarStat({ label, value, compact }: { label: string; value: string | number; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-[#dbe3f0] bg-white ${compact ? 'px-2 py-2.5 text-center' : 'px-3 py-2.5'} shadow-[0_1px_2px_rgba(60,64,67,0.08)]`}>
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#5f6368]">{compact ? label.slice(0, 4) : label}</p>
      <p className={`mt-1.5 font-semibold text-[#202124] ${compact ? 'text-sm' : 'text-base'}`}>{value}</p>
    </div>
  );
}

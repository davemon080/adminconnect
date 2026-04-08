import { Link2, LogOut, ShieldCheck, X } from 'lucide-react';
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
  onSignOut,
  signingOut,
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
  onSignOut: () => void;
  signingOut?: boolean;
}) {
  const meta: Record<AdminTab, number> = {
    overview: totalUsers,
    users: totalUsers,
    partners: pendingPartners,
    jobs: 0,
    market: 0,
    feed: 0,
    wallet: 0,
    notifications: 0,
    reports: 0,
  };

  return (
    <aside
      className={`fixed inset-y-2 left-2 z-40 flex w-[min(86vw,288px)] flex-col rounded-[28px] border border-[#dbe3f0] bg-white/96 p-3 shadow-[0_8px_30px_rgba(60,64,67,0.12)] backdrop-blur transition-transform duration-300 lg:sticky lg:top-4 lg:z-10 lg:h-[calc(100vh-2rem)] lg:w-auto lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'
      } ${sidebarCollapsed ? 'lg:px-2.5' : 'lg:px-4'}`}
    >
      <div className={`flex items-center justify-between gap-3 px-2 py-2.5 ${sidebarCollapsed ? 'lg:px-1.5' : ''}`}>
        <div className={`min-w-0 ${sidebarCollapsed ? 'lg:w-full' : ''}`}>
          <div className={`flex items-center gap-2 text-2xl font-bold text-teal-700 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Link2 className="h-4 w-4" />
            </span>
            {!sidebarCollapsed ? <span>Connect</span> : null}
          </div>
          {!sidebarCollapsed ? <p className="mt-2 pl-10 text-xs text-[#5f6368]">Admin panel</p> : null}
        </div>
        <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-2xl p-2 text-[#5f6368] hover:bg-[#f3f6fb] lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-colors ${
                active ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${sidebarCollapsed ? 'lg:px-2 lg:justify-center' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              title={sidebarCollapsed ? tab.label : undefined}
            >
              <div className="relative shrink-0">
                <Icon className="h-5 w-5" />
                {!sidebarCollapsed && meta[tab.id] > 0 && tab.id === 'partners' ? (
                  <span className="absolute -right-2 -top-2 min-w-[16px] rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {meta[tab.id] > 99 ? '99+' : meta[tab.id]}
                  </span>
                ) : null}
              </div>
              {!sidebarCollapsed ? (
                <span className="flex-1 truncate">{tab.label}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-3 border-t border-gray-100 pt-4">
        <div className={`flex items-center gap-3 px-4 py-3 ${sidebarCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
          <img src={adminProfile?.photoURL || 'https://placehold.co/80x80'} alt={adminProfile?.displayName || 'Admin'} className="h-10 w-10 rounded-full border border-gray-200 object-cover" />
          {!sidebarCollapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">{adminProfile?.displayName || 'Admin user'}</p>
              <p className="truncate text-xs text-gray-500">{adminProfile?.email || 'Signed in'}</p>
            </div>
          ) : null}
        </div>
        <button
          onClick={onSignOut}
          disabled={signingOut}
          type="button"
          title="Sign out"
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 ${sidebarCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}
        >
          <LogOut className="h-5 w-5" />
          {!sidebarCollapsed ? <span>{signingOut ? 'Signing out...' : 'Sign out'}</span> : null}
        </button>
        {!sidebarCollapsed ? (
          <div className="mt-3 px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-medium text-teal-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {pendingPartners > 0 ? `${pendingPartners} pending approvals` : 'Admin access active'}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

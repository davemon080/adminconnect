import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Activity, Building2, CreditCard, LayoutDashboard, Search, ShieldCheck, Store, UserRound, Wallet } from 'lucide-react';
import {
  AdminMarketDraft,
  AdminPartnerRequest,
  AdminUserCommandCenter,
  AdminUserProfile,
  AdminUserProfileDraft,
} from '../../types';
import AccountDetailsPage from './user/AccountDetailsPage';
import FootprintPage from './user/FootprintPage';
import MarketplaceAccessPage from './user/MarketplaceAccessPage';
import ProfileControlPage from './user/ProfileControlPage';
import TransactionsPage from './user/TransactionsPage';
import WalletManagementPage from './user/WalletManagementPage';
import { EmptyState, InfoChip, Panel, formatDate } from './user/shared';

type UserWorkspaceTab = 'account' | 'profile' | 'transactions' | 'wallet' | 'access' | 'footprint';

const userTabs: Array<{ id: UserWorkspaceTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'account', label: 'Account details', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile control', icon: UserRound },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'wallet', label: 'Wallet management', icon: Wallet },
  { id: 'access', label: 'Marketplace and partner access', icon: Store },
  { id: 'footprint', label: 'User footprint', icon: Activity },
];

interface AdminUserWorkspaceProps {
  filteredUsers: AdminUserProfile[];
  selectedUserUid: string | null;
  setSelectedUserUid: (value: string) => void;
  userSearch: string;
  setUserSearch: (value: string) => void;
  loadingSelectedUser: boolean;
  selectedUser: AdminUserCommandCenter | null;
  userDraft: AdminUserProfileDraft | null;
  setUserDraft: Dispatch<SetStateAction<AdminUserProfileDraft | null>>;
  marketDraft: AdminMarketDraft | null;
  setMarketDraft: Dispatch<SetStateAction<AdminMarketDraft | null>>;
  walletAmount: string;
  setWalletAmount: (value: string) => void;
  walletCurrency: 'USD' | 'NGN' | 'EUR';
  setWalletCurrency: (value: 'USD' | 'NGN' | 'EUR') => void;
  walletNote: string;
  setWalletNote: (value: string) => void;
  onSaveUserProfile: () => void;
  onSaveMarketAccess: () => void;
  onApplyWalletAdjustment: () => void;
  onApprovePartner: (id: string) => void;
  onRejectPartner: (id: string) => void;
  onDeletePost: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onDeleteMarketItem: (id: string) => void;
  onDeleteJob: (id: string) => void;
  onToggleJobStatus: (id: string, status: 'open' | 'closed') => void;
  totalUsers: number;
}

export default function AdminUserWorkspace({
  filteredUsers,
  selectedUserUid,
  setSelectedUserUid,
  userSearch,
  setUserSearch,
  loadingSelectedUser,
  selectedUser,
  userDraft,
  setUserDraft,
  marketDraft,
  setMarketDraft,
  walletAmount,
  setWalletAmount,
  walletCurrency,
  setWalletCurrency,
  walletNote,
  setWalletNote,
  onSaveUserProfile,
  onSaveMarketAccess,
  onApplyWalletAdjustment,
  onApprovePartner,
  onRejectPartner,
  onDeletePost,
  onDeleteComment,
  onDeleteMarketItem,
  onDeleteJob,
  onToggleJobStatus,
  totalUsers,
}: AdminUserWorkspaceProps) {
  const [activeUserTab, setActiveUserTab] = useState<UserWorkspaceTab>('account');

  useEffect(() => {
    setActiveUserTab('account');
  }, [selectedUserUid]);

  const activeTabMeta = useMemo(
    () => userTabs.find((tab) => tab.id === activeUserTab) || userTabs[0],
    [activeUserTab]
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
      <Panel title="User roster" subtitle="Search, select, and jump into the exact management page you need.">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search name, email, role, location, or public ID"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <MiniMetric label="All" value={totalUsers} />
              <MiniMetric label="Visible" value={filteredUsers.length} />
              <MiniMetric label="Admins" value={filteredUsers.filter((user) => user.role === 'admin').length} />
            </div>
          </div>

          <div className="max-h-[72vh] space-y-3 overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? <EmptyState body="No users match this search yet." /> : null}
            {filteredUsers.map((user) => {
              const active = user.uid === selectedUserUid;
              return (
                <button
                  key={user.uid}
                  type="button"
                  onClick={() => setSelectedUserUid(user.uid)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    active
                      ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)]'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL} alt={user.displayName} className="h-12 w-12 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{user.displayName}</p>
                      <p className={`truncate text-sm ${active ? 'text-slate-300' : 'text-slate-500'}`}>{user.email}</p>
                    </div>
                  </div>
                  <div className={`mt-3 flex flex-wrap gap-2 text-xs ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                    <span>{user.publicId || user.uid}</span>
                    <span>•</span>
                    <span>{user.location || 'No location'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel title="User account manager" subtitle="Dedicated linked sections for account details, profile, transactions, wallet, access, and footprint.">
        {!selectedUserUid ? (
          <EmptyState body="Select a user to open the account manager." />
        ) : loadingSelectedUser ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Activity className="h-6 w-6 animate-pulse text-slate-500" />
          </div>
        ) : !selectedUser ? (
          <EmptyState body="User detail could not be loaded right now." />
        ) : (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_48%,#164e63_100%)] text-white">
              <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <img src={selectedUser.profile.photoURL} alt={selectedUser.profile.displayName} className="h-20 w-20 rounded-[28px] border border-white/15 object-cover shadow-lg" />
                    <div>
                      <h3 className="text-2xl font-semibold">{selectedUser.profile.displayName}</h3>
                      <p className="mt-1 text-sm text-slate-300">{selectedUser.profile.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                        <span>{selectedUser.profile.publicId || selectedUser.profile.uid}</span>
                        <span>•</span>
                        <span>{selectedUser.profile.location || 'No location'}</span>
                        <span>•</span>
                        <span>{formatDate(selectedUser.profile.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <InfoChip text={selectedUser.profile.role} />
                    <InfoChip text={selectedUser.marketSettings.isRegistered ? 'Market unlocked' : 'Market locked'} />
                    <InfoChip text={selectedUser.hasTransactionPin ? 'Transaction pin enabled' : 'No transaction pin'} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2">
                  <MiniMetricDark label="Posts" value={selectedUser.metrics.posts} />
                  <MiniMetricDark label="Wallet txns" value={selectedUser.metrics.walletTransactions} />
                  <MiniMetricDark label="Messages" value={selectedUser.metrics.messages} />
                  <MiniMetricDark label="Connections" value={selectedUser.metrics.connections} />
                  <MiniMetricDark label="Ratings" value={selectedUser.metrics.sellerRatings} />
                  <MiniMetricDark label="Follows" value={selectedUser.metrics.companyFollows} />
                </div>
              </div>
            </div>

            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
              {userTabs.map((tab) => {
                const Icon = tab.icon;
                const active = tab.id === activeUserTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveUserTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[26px] border border-slate-200 bg-white p-4 sm:p-5">
              <div className="mb-5 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Linked admin page</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{activeTabMeta.label}</h3>
                </div>
                <InfoChip text={`User: ${selectedUser.profile.displayName}`} />
              </div>

              {activeUserTab === 'account' ? <AccountDetailsPage selectedUser={selectedUser} /> : null}
              {activeUserTab === 'profile' ? (
                <ProfileControlPage
                  userDraft={userDraft}
                  setUserDraft={setUserDraft}
                  onSaveUserProfile={onSaveUserProfile}
                  currentEmail={selectedUser.profile.email}
                  currentLocation={selectedUser.profile.location}
                  currentPhone={selectedUser.profile.phoneNumber}
                />
              ) : null}
              {activeUserTab === 'transactions' ? <TransactionsPage selectedUser={selectedUser} /> : null}
              {activeUserTab === 'wallet' ? (
                <WalletManagementPage
                  selectedUser={selectedUser}
                  walletAmount={walletAmount}
                  setWalletAmount={setWalletAmount}
                  walletCurrency={walletCurrency}
                  setWalletCurrency={setWalletCurrency}
                  walletNote={walletNote}
                  setWalletNote={setWalletNote}
                  onApplyWalletAdjustment={onApplyWalletAdjustment}
                />
              ) : null}
              {activeUserTab === 'access' ? (
                <MarketplaceAccessPage
                  selectedUser={selectedUser}
                  marketDraft={marketDraft}
                  setMarketDraft={setMarketDraft}
                  onSaveMarketAccess={onSaveMarketAccess}
                  onApprovePartner={onApprovePartner}
                  onRejectPartner={onRejectPartner}
                />
              ) : null}
              {activeUserTab === 'footprint' ? (
                <FootprintPage
                  selectedUser={selectedUser}
                  onApprovePartner={onApprovePartner}
                  onRejectPartner={onRejectPartner}
                  onDeletePost={onDeletePost}
                  onDeleteComment={onDeleteComment}
                  onDeleteMarketItem={onDeleteMarketItem}
                  onDeleteJob={onDeleteJob}
                  onToggleJobStatus={onToggleJobStatus}
                />
              ) : null}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MiniMetricDark({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Activity, CreditCard, LayoutDashboard, Search, Store, UserRound, Wallet } from 'lucide-react';
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
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)]">
      <Panel title="User roster" subtitle="Search, select, and jump into the exact management page you need.">
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#dbe3f0] bg-white p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6368]" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search name, email, role, location, or public ID"
                className="w-full rounded-2xl border border-[#dbe3f0] bg-[#f8fafd] py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-2 focus:ring-[#e8f0fe]"
              />
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-2.5">
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
                  className={`w-full rounded-3xl border p-3.5 text-left transition ${
                    active
                      ? 'border-[#1a73e8] bg-[#e8f0fe] text-[#174ea6] shadow-[0_4px_14px_rgba(26,115,232,0.14)]'
                      : 'border-[#dbe3f0] bg-[#f8fafd] hover:border-[#bfd3f2] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL} alt={user.displayName} className="h-11 w-11 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{user.displayName}</p>
                      <p className={`truncate text-xs ${active ? 'text-[#5f6368]' : 'text-[#5f6368]'}`}>{user.email}</p>
                    </div>
                  </div>
                  <div className={`mt-2.5 flex flex-wrap gap-2 text-[11px] ${active ? 'text-[#5f6368]' : 'text-[#5f6368]'}`}>
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
            <div className="overflow-hidden rounded-[28px] border border-[#dbe3f0] bg-[linear-gradient(180deg,#ffffff_0%,#f8fafd_100%)] text-[#202124] shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
              <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <img src={selectedUser.profile.photoURL} alt={selectedUser.profile.displayName} className="h-16 w-16 rounded-[24px] border border-[#dbe3f0] object-cover" />
                    <div>
                      <h3 className="text-xl font-semibold">{selectedUser.profile.displayName}</h3>
                      <p className="mt-1 text-sm text-[#5f6368]">{selectedUser.profile.email}</p>
                      <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-[#5f6368]">
                        <span>{selectedUser.profile.publicId || selectedUser.profile.uid}</span>
                        <span>•</span>
                        <span>{selectedUser.profile.location || 'No location'}</span>
                        <span>•</span>
                        <span>{formatDate(selectedUser.profile.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <InfoChip text={selectedUser.profile.role} />
                    <InfoChip text={selectedUser.marketSettings.isRegistered ? 'Market unlocked' : 'Market locked'} />
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-2">
                  <MiniMetricDark label="Posts" value={selectedUser.metrics.posts} />
                  <MiniMetricDark label="Wallet txns" value={selectedUser.metrics.walletTransactions} />
                  <MiniMetricDark label="Messages" value={selectedUser.metrics.messages} />
                  <MiniMetricDark label="Connections" value={selectedUser.metrics.connections} />
                </div>
              </div>
            </div>

            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
              {userTabs.map((tab) => {
                const Icon = tab.icon;
                const active = tab.id === activeUserTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveUserTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                      active ? 'bg-[#1a73e8] text-white' : 'border border-[#dbe3f0] bg-white text-[#3c4043] hover:bg-[#f8fafd]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[26px] border border-[#dbe3f0] bg-white p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.08)] sm:p-4">
              <div className="mb-4 flex flex-col gap-2 border-b border-[#eef2f7] pb-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f6368]">Linked admin page</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#202124]">{activeTabMeta.label}</h3>
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
    <div className="rounded-2xl border border-[#dbe3f0] bg-[#f8fafd] px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#5f6368]">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-[#202124]">{value}</p>
    </div>
  );
}

function MiniMetricDark({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#dbe3f0] bg-white px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#5f6368]">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-[#202124]">{value}</p>
    </div>
  );
}

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  PencilLine,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import { adminService } from './services/adminService';
import { supabase } from './supabase';
import {
  AdminSnapshot,
  AdminTab,
  AdminUserCommandCenter,
  AdminUserProfile,
  AdminUserRole,
} from './types';

const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'partners', label: 'Partners', icon: Building2 },
  { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { id: 'market', label: 'Market', icon: Store },
  { id: 'feed', label: 'Feed', icon: Trash2 },
  { id: 'wallet', label: 'Wallet', icon: CreditCard },
];

const emptySnapshot: AdminSnapshot = {
  overview: {
    totalUsers: 0,
    totalAdmins: 0,
    pendingPartners: 0,
    openJobs: 0,
    marketItems: 0,
    posts: 0,
    comments: 0,
    walletTransactions: 0,
  },
  users: [],
  partnerRequests: [],
  jobs: [],
  marketItems: [],
  posts: [],
  comments: [],
  walletTransactions: [],
};

type UserProfileDraft = {
  displayName: string;
  email: string;
  role: AdminUserRole;
  phoneNumber: string;
  status: string;
  location: string;
  bio: string;
  skills: string;
  companyName: string;
  companyAbout: string;
};

type MarketDraft = {
  isRegistered: boolean;
  accessOverride: 'inherit' | 'force_unlock' | 'force_lock';
  phoneNumber: string;
  location: string;
  brandName: string;
  showPhoneNumber: boolean;
  showLocation: boolean;
  showBrandName: boolean;
};

function formatDate(value?: string) {
  if (!value) return 'Unknown';
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return value;
  }
}

function formatMoney(value: number, currency: 'USD' | 'NGN' | 'EUR') {
  const locale = currency === 'NGN' ? 'en-NG' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value || 0);
}

function buildProfileDraft(user: AdminUserCommandCenter): UserProfileDraft {
  return {
    displayName: user.profile.displayName,
    email: user.profile.email,
    role: user.profile.role,
    phoneNumber: user.profile.phoneNumber || '',
    status: user.profile.status || '',
    location: user.profile.location || '',
    bio: user.profile.bio || '',
    skills: user.profile.skills.join(', '),
    companyName: user.profile.companyInfo?.name || '',
    companyAbout: user.profile.companyInfo?.about || '',
  };
}

function buildMarketDraft(user: AdminUserCommandCenter): MarketDraft {
  return {
    isRegistered: user.marketSettings.baseIsRegistered,
    accessOverride: user.marketSettings.accessOverride,
    phoneNumber: user.marketSettings.phoneNumber || '',
    location: user.marketSettings.location || '',
    brandName: user.marketSettings.brandName || '',
    showPhoneNumber: user.marketSettings.showPhoneNumber,
    showLocation: user.marketSettings.showLocation,
    showBrandName: user.marketSettings.showBrandName,
  };
}

function App() {
  const [sessionUid, setSessionUid] = useState<string | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile | null>(null);
  const [snapshot, setSnapshot] = useState<AdminSnapshot>(emptySnapshot);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [actionState, setActionState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserCommandCenter | null>(null);
  const [loadingSelectedUser, setLoadingSelectedUser] = useState(false);
  const [userDraft, setUserDraft] = useState<UserProfileDraft | null>(null);
  const [marketDraft, setMarketDraft] = useState<MarketDraft | null>(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletCurrency, setWalletCurrency] = useState<'USD' | 'NGN' | 'EUR'>('USD');
  const [walletNote, setWalletNote] = useState('');

  const pendingPartners = useMemo(
    () => snapshot.partnerRequests.filter((item) => item.status === 'pending'),
    [snapshot.partnerRequests]
  );

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return snapshot.users;
    return snapshot.users.filter((user) => {
      return (
        user.displayName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.publicId?.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query)
      );
    });
  }, [snapshot.users, userSearch]);

  const refresh = async (uid = sessionUid) => {
    if (!uid) return;
    setLoadingData(true);
    setError(null);
    try {
      const [profile, nextSnapshot] = await Promise.all([
        adminService.getAdminProfile(uid),
        adminService.getSnapshot(),
      ]);
      setAdminProfile(profile);
      setSnapshot(nextSnapshot);
      if (!profile || profile.role !== 'admin') {
        setError('This account does not have admin access.');
      }
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to load admin data.');
    } finally {
      setLoadingData(false);
    }
  };

  const loadSelectedUser = async (uid: string) => {
    setLoadingSelectedUser(true);
    try {
      const detail = await adminService.getUserCommandCenter(uid);
      setSelectedUser(detail);
      setUserDraft(buildProfileDraft(detail));
      setMarketDraft(buildMarketDraft(detail));
      setWalletCurrency('USD');
      setWalletAmount('');
      setWalletNote('');
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to load this user.');
    } finally {
      setLoadingSelectedUser(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        const session = await adminService.getSession();
        if (mounted) {
          setSessionUid(session?.user?.id || null);
        }
      } catch (nextError: any) {
        if (mounted) {
          setError(nextError?.message || 'Unable to initialize admin session.');
        }
      } finally {
        if (mounted) {
          setLoadingAuth(false);
        }
      }
    };

    void boot();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUid(session?.user?.id || null);
      setError(null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionUid) {
      setAdminProfile(null);
      setSnapshot(emptySnapshot);
      return;
    }

    void refresh(sessionUid);
    const unsubscribe = adminService.subscribeToAdminChanges(() => {
      void refresh(sessionUid);
      if (selectedUserUid) {
        void loadSelectedUser(selectedUserUid);
      }
    });
    return unsubscribe;
  }, [sessionUid, selectedUserUid]);

  useEffect(() => {
    if (activeTab !== 'users') return;
    if (snapshot.users.length === 0) {
      setSelectedUserUid(null);
      setSelectedUser(null);
      return;
    }

    const stillExists = selectedUserUid && snapshot.users.some((user) => user.uid === selectedUserUid);
    if (!stillExists) {
      setSelectedUserUid(snapshot.users[0].uid);
    }
  }, [activeTab, snapshot.users, selectedUserUid]);

  useEffect(() => {
    if (activeTab !== 'users' || !selectedUserUid) return;
    void loadSelectedUser(selectedUserUid);
  }, [activeTab, selectedUserUid]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigningIn(true);
    setError(null);
    try {
      await adminService.signIn(email.trim(), password);
      const session = await adminService.getSession();
      setSessionUid(session?.user?.id || null);
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to sign in.');
    } finally {
      setSigningIn(false);
    }
  };

  const runAction = async (label: string, callback: () => Promise<void>) => {
    setActionState(label);
    setError(null);
    try {
      await callback();
      await refresh();
      if (selectedUserUid) {
        await loadSelectedUser(selectedUserUid);
      }
    } catch (nextError: any) {
      setError(nextError?.message || `Unable to ${label.toLowerCase()}.`);
    } finally {
      setActionState(null);
    }
  };

  const handleSignOut = async () => {
    await runAction('Signing out', async () => {
      await adminService.signOut();
      setSessionUid(null);
      setAdminProfile(null);
      setSnapshot(emptySnapshot);
      setSelectedUserUid(null);
      setSelectedUser(null);
    });
  };

  const handleSaveUserProfile = async () => {
    if (!selectedUser || !userDraft) return;
    await runAction('Saving user profile', async () => {
      await adminService.updateUserProfile(selectedUser.profile.uid, {
        displayName: userDraft.displayName.trim(),
        email: userDraft.email.trim(),
        role: userDraft.role,
        phoneNumber: userDraft.phoneNumber.trim(),
        status: userDraft.status.trim(),
        location: userDraft.location.trim(),
        bio: userDraft.bio.trim(),
        skills: userDraft.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        companyName: userDraft.companyName.trim(),
        companyAbout: userDraft.companyAbout.trim(),
      });
    });
  };

  const handleSaveMarketAccess = async () => {
    if (!selectedUser || !marketDraft) return;
    await runAction('Updating marketplace access', async () => {
      await adminService.updateMarketplaceAccess(selectedUser.profile.uid, {
        isRegistered: marketDraft.isRegistered,
        accessOverride: marketDraft.accessOverride,
        phoneNumber: marketDraft.phoneNumber.trim(),
        location: marketDraft.location.trim(),
        brandName: marketDraft.brandName.trim(),
        showPhoneNumber: marketDraft.showPhoneNumber,
        showLocation: marketDraft.showLocation,
        showBrandName: marketDraft.showBrandName,
      });
    });
  };

  const handleWalletAdjustment = async () => {
    if (!selectedUser) return;
    const parsed = Number(walletAmount);
    if (!Number.isFinite(parsed) || parsed === 0) {
      setError('Enter a valid wallet adjustment amount.');
      return;
    }

    await runAction('Adjusting wallet', async () => {
      await adminService.adjustUserWallet(selectedUser.profile.uid, walletCurrency, parsed, walletNote.trim());
    });
  };

  if (loadingAuth) {
    return <FullScreenMessage title="Opening Connect Admin" body="Checking your session and preparing the dashboard." />;
  }

  if (!sessionUid) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/60 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-amber-200">
              <ShieldCheck className="h-4 w-4" />
              Connect Admin
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              One control room for users, partner approvals, jobs, market items, feed moderation, and wallet activity.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              This lives in a separate `connect_admin` app so we can keep extending the main product and the admin side together without mixing those concerns.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <Highlight title="Realtime aware" body="Auto-refreshes when the main app tables change." />
              <Highlight title="Moderation ready" body="Approve companies and remove risky content fast." />
              <Highlight title="Built to grow" body="We can keep expanding this panel as the app evolves." />
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/80 bg-white/92 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
            <h2 className="text-2xl font-semibold text-slate-900">Admin sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use an account whose `users.role` is set to `admin`.</p>
            <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
              <Field label="Email">
                <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@connect.app" required />
              </Field>
              <Field label="Password">
                <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
              </Field>
              {error ? <ErrorBanner message={error} /> : null}
              <button className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={signingIn}>
                {signingIn ? 'Signing In...' : 'Sign In to Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (adminProfile && adminProfile.role !== 'admin') {
    return (
      <FullScreenMessage
        title="Admin access required"
        body="This account is signed in, but it is not marked as an admin in the users table."
        action={<button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white" onClick={() => void handleSignOut()}>Sign Out</button>}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1680px] gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="rounded-[28px] bg-slate-950 p-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-200">
              <ShieldCheck className="h-4 w-4" />
              Control Room
            </div>
            <h1 className="mt-4 text-2xl font-semibold">Connect Admin</h1>
            <p className="mt-2 text-sm text-slate-300">Built to stay aligned with the user app as we keep shipping.</p>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <img src={adminProfile?.photoURL || 'https://placehold.co/80x80'} alt={adminProfile?.displayName || 'Admin'} className="h-12 w-12 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{adminProfile?.displayName || 'Admin user'}</p>
                <p className="truncate text-sm text-slate-500">{adminProfile?.email || 'Signed in'}</p>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${active ? 'bg-slate-950 text-white' : 'bg-transparent text-slate-700 hover:bg-slate-100'}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-5">
          <header className="flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Workspace</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                {activeTab === 'overview' ? 'Operations overview' : activeTab === 'users' ? 'User command center' : `${tabs.find((item) => item.id === activeTab)?.label} management`}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {activeTab === 'users'
                  ? 'Open any user and manage their full footprint across the platform.'
                  : 'You can manage the product here while we keep improving both apps side by side.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                onClick={() => void refresh()}
                type="button"
                disabled={loadingData}
              >
                <RefreshCw className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                onClick={() => void handleSignOut()}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </header>

          {error ? <ErrorBanner message={error} /> : null}
          {actionState ? <InfoBanner message={`${actionState}...`} /> : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Users" value={snapshot.overview.totalUsers} hint={`${snapshot.overview.totalAdmins} admins in the system`} />
            <MetricCard label="Pending Partners" value={snapshot.overview.pendingPartners} hint="Waiting for approval" />
            <MetricCard label="Open Jobs" value={snapshot.overview.openJobs} hint="Currently visible gigs" />
            <MetricCard label="Market Items" value={snapshot.overview.marketItems} hint="Live marketplace listings" />
          </div>

          {activeTab === 'overview' ? (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <SectionCard title="Approval queue" subtitle="Latest companies waiting to partner with Connect.">
                <div className="space-y-3">
                  {pendingPartners.length === 0 ? <EmptyState body="No partner requests are waiting right now." /> : null}
                  {pendingPartners.slice(0, 6).map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <img src={item.companyLogoUrl} alt={item.companyName} className="h-12 w-12 rounded-2xl object-cover" />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">{item.companyName}</p>
                              <p className="text-sm text-slate-500">{item.location} • {formatDate(item.createdAt)}</p>
                            </div>
                          </div>
                          <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.about}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <ActionButton label="Approve" tone="dark" onClick={() => void runAction('Approving partner request', () => adminService.updatePartnerRequestStatus(item.id, 'approved'))} />
                          <ActionButton label="Reject" tone="light" onClick={() => void runAction('Rejecting partner request', () => adminService.updatePartnerRequestStatus(item.id, 'rejected'))} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Quick pulse" subtitle="Fresh activity snapshots from the platform.">
                <QuickList title="Newest users" items={snapshot.users.slice(0, 5).map((user) => ({ title: user.displayName, subtitle: `${user.role} • ${user.email}`, meta: formatDate(user.createdAt) }))} />
                <QuickList title="Newest jobs" items={snapshot.jobs.slice(0, 5).map((job) => ({ title: job.title, subtitle: `${job.category} • ${job.status}`, meta: formatDate(job.createdAt) }))} />
                <QuickList title="Wallet activity" items={snapshot.walletTransactions.slice(0, 5).map((item) => ({ title: `${item.amount} ${item.currency}`, subtitle: `${item.type} • ${item.method} • ${item.status}`, meta: formatDate(item.createdAt) }))} />
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'users' ? (
            <UserCommandCenter
              filteredUsers={filteredUsers}
              selectedUserUid={selectedUserUid}
              setSelectedUserUid={setSelectedUserUid}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              loadingSelectedUser={loadingSelectedUser}
              selectedUser={selectedUser}
              userDraft={userDraft}
              setUserDraft={setUserDraft}
              marketDraft={marketDraft}
              setMarketDraft={setMarketDraft}
              walletAmount={walletAmount}
              setWalletAmount={setWalletAmount}
              walletCurrency={walletCurrency}
              setWalletCurrency={setWalletCurrency}
              walletNote={walletNote}
              setWalletNote={setWalletNote}
              onSaveUserProfile={() => void handleSaveUserProfile()}
              onSaveMarketAccess={() => void handleSaveMarketAccess()}
              onApplyWalletAdjustment={() => void handleWalletAdjustment()}
              onApprovePartner={(id) => void runAction('Approving partner request', () => adminService.updatePartnerRequestStatus(id, 'approved'))}
              onRejectPartner={(id) => void runAction('Rejecting partner request', () => adminService.updatePartnerRequestStatus(id, 'rejected'))}
              onDeletePost={(id) => void runAction('Deleting post', () => adminService.deletePost(id))}
              onDeleteComment={(id) => void runAction('Deleting comment', () => adminService.deleteComment(id))}
              onDeleteMarketItem={(id) => void runAction('Deleting market item', () => adminService.deleteMarketItem(id))}
              onDeleteJob={(id) => void runAction('Deleting job', () => adminService.deleteJob(id))}
              onToggleJobStatus={(id, status) => void runAction(status === 'open' ? 'Closing job' : 'Reopening job', () => adminService.updateJobStatus(id, status))}
              totalUsers={snapshot.users.length}
            />
          ) : null}

          {activeTab === 'partners' ? (
            <SectionCard title="Partner requests" subtitle="Approve or reject company onboarding.">
              <div className="grid gap-4">
                {snapshot.partnerRequests.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-4">
                          <img src={item.companyLogoUrl} alt={item.companyName} className="h-14 w-14 rounded-2xl object-cover" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="truncate text-lg font-semibold text-slate-900">{item.companyName}</h3>
                              <StatusPill text={item.status} tone={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'} />
                            </div>
                            <p className="text-sm text-slate-500">{item.location} • {formatDate(item.createdAt)}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">{item.about}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <ActionButton label="Approve" tone="dark" onClick={() => void runAction('Approving partner request', () => adminService.updatePartnerRequestStatus(item.id, 'approved'))} />
                        <ActionButton label="Reject" tone="light" onClick={() => void runAction('Rejecting partner request', () => adminService.updatePartnerRequestStatus(item.id, 'rejected'))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === 'jobs' ? (
            <SectionCard title="Jobs" subtitle="Manage gigs visible on the jobs page.">
              <div className="grid gap-4">
                {snapshot.jobs.map((job) => (
                  <div key={job.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                          <StatusPill text={job.status} tone={job.status === 'open' ? 'success' : 'light'} />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{job.category} • {job.isRemote ? 'Remote' : 'On-site'} • Budget {job.budget}</p>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{job.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <ActionButton
                          label={job.status === 'open' ? 'Close Job' : 'Reopen Job'}
                          tone="light"
                          onClick={() => void runAction(job.status === 'open' ? 'Closing job' : 'Reopening job', () => adminService.updateJobStatus(job.id, job.status === 'open' ? 'closed' : 'open'))}
                        />
                        <DangerButton
                          label="Delete"
                          onClick={() => {
                            if (window.confirm('Delete this job permanently?')) {
                              void runAction('Deleting job', () => adminService.deleteJob(job.id));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === 'market' ? (
            <SectionCard title="Market items" subtitle="Review live marketplace inventory.">
              <div className="grid gap-4">
                {snapshot.marketItems.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                          <StatusPill text={item.category} tone="light" />
                          {item.isAnonymous ? <StatusPill text="Anonymous" tone="warning" /> : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{item.price} {item.priceCurrency} • Stock {item.stockQuantity}</p>
                        <p className="mt-2 text-sm text-slate-500">Seller UID: {item.sellerUid} • {formatDate(item.createdAt)}</p>
                      </div>
                      <DangerButton label="Delete Listing" onClick={() => void runAction('Deleting market item', () => adminService.deleteMarketItem(item.id))} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {activeTab === 'feed' ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <SectionCard title="Posts" subtitle="Latest feed posts.">
                <CompactList
                  empty="No recent posts."
                  items={snapshot.posts.map((post) => ({
                    id: post.id,
                    title: `${post.authorName} • ${post.type}`,
                    subtitle: post.content,
                    meta: formatDate(post.createdAt),
                  }))}
                />
              </SectionCard>
              <SectionCard title="Comments" subtitle="Latest feed comments and replies.">
                <CompactList
                  empty="No recent comments."
                  items={snapshot.comments.map((comment) => ({
                    id: comment.id,
                    title: `${comment.authorName} on ${comment.postId}`,
                    subtitle: comment.content,
                    meta: formatDate(comment.createdAt),
                  }))}
                />
              </SectionCard>
            </div>
          ) : null}

          {activeTab === 'wallet' ? (
            <SectionCard title="Wallet transactions" subtitle="Recent balance movement across the platform.">
              <CompactList
                empty="No recent wallet transactions."
                items={snapshot.walletTransactions.map((item) => ({
                  id: item.id,
                  title: `${item.type} • ${item.amount} ${item.currency}`,
                  subtitle: `${item.method} • ${item.status} • ${item.userUid}`,
                  meta: formatDate(item.createdAt),
                }))}
              />
            </SectionCard>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function UserCommandCenter({
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
}: {
  filteredUsers: AdminUserProfile[];
  selectedUserUid: string | null;
  setSelectedUserUid: (value: string) => void;
  userSearch: string;
  setUserSearch: (value: string) => void;
  loadingSelectedUser: boolean;
  selectedUser: AdminUserCommandCenter | null;
  userDraft: UserProfileDraft | null;
  setUserDraft: React.Dispatch<React.SetStateAction<UserProfileDraft | null>>;
  marketDraft: MarketDraft | null;
  setMarketDraft: React.Dispatch<React.SetStateAction<MarketDraft | null>>;
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
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <SectionCard title="User roster" subtitle="Search, filter, and open any account for deeper control.">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search name, email, role, location, or public ID"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <MiniMetric label="All" value={totalUsers} />
              <MiniMetric label="Visible" value={filteredUsers.length} />
              <MiniMetric label="Admins" value={filteredUsers.filter((user) => user.role === 'admin').length} />
            </div>
          </div>

          <div className="max-h-[900px] space-y-3 overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? <EmptyState body="No users match this search yet." /> : null}
            {filteredUsers.map((user) => {
              const active = user.uid === selectedUserUid;
              return (
                <button
                  key={user.uid}
                  type="button"
                  onClick={() => setSelectedUserUid(user.uid)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${active ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)]' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.photoURL} alt={user.displayName} className="h-12 w-12 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold">{user.displayName}</p>
                        <StatusPill text={user.role} tone={active ? 'lightOnDark' : user.role === 'admin' ? 'dark' : 'light'} />
                      </div>
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
      </SectionCard>

      <SectionCard title="User command center" subtitle="Profile control, access overrides, wallet power, and content moderation in one place.">
        {!selectedUserUid ? (
          <EmptyState body="Select a user to open their command center." />
        ) : loadingSelectedUser ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : !selectedUser || !userDraft || !marketDraft ? (
          <EmptyState body="User detail could not be loaded right now." />
        ) : (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_48%,#164e63_100%)] text-white">
              <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-7">
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <img src={selectedUser.profile.photoURL} alt={selectedUser.profile.displayName} className="h-20 w-20 rounded-[28px] border border-white/15 object-cover shadow-lg" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold">{selectedUser.profile.displayName}</h3>
                        <StatusPill text={selectedUser.profile.role} tone="lightOnDark" />
                      </div>
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
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
                    {selectedUser.profile.bio || 'This user has not added a bio yet. The admin still has full visibility and control over the account state below.'}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <HeroMetric icon={Activity} label="Posts" value={selectedUser.metrics.posts} />
                  <HeroMetric icon={MessageSquare} label="Messages" value={selectedUser.metrics.messages} />
                  <HeroMetric icon={Store} label="Market items" value={selectedUser.metrics.marketItems} />
                  <HeroMetric icon={Wallet} label="Wallet txns" value={selectedUser.metrics.walletTransactions} />
                </div>
              </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[1.05fr_0.95fr]">
              <AdminPanel title="Profile control" subtitle="Directly edit the user identity data that shapes their account across the app." icon={PencilLine}>
                <div className="grid gap-4 md:grid-cols-2">
                  <LabeledInput label="Display name" value={userDraft.displayName} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, displayName: value } : prev)} />
                  <LabeledInput label="Email" value={userDraft.email} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, email: value } : prev)} />
                  <LabeledSelect<AdminUserRole> label="Role" value={userDraft.role} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, role: value } : prev)} options={[{ value: 'freelancer', label: 'Freelancer' }, { value: 'client', label: 'Client' }, { value: 'admin', label: 'Admin' }]} />
                  <LabeledInput label="Phone" value={userDraft.phoneNumber} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, phoneNumber: value } : prev)} />
                  <LabeledInput label="Location" value={userDraft.location} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, location: value } : prev)} />
                  <LabeledInput label="Status headline" value={userDraft.status} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, status: value } : prev)} />
                  <div className="md:col-span-2">
                    <LabeledTextArea label="Bio" value={userDraft.bio} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, bio: value } : prev)} />
                  </div>
                  <div className="md:col-span-2">
                    <LabeledInput label="Skills" hint="Comma-separated" value={userDraft.skills} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, skills: value } : prev)} />
                  </div>
                  <LabeledInput label="Company name" value={userDraft.companyName} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, companyName: value } : prev)} />
                  <div className="md:col-span-2">
                    <LabeledTextArea label="Company about" value={userDraft.companyAbout} onChange={(value) => setUserDraft((prev) => prev ? { ...prev, companyAbout: value } : prev)} />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ActionButton label="Save profile changes" tone="dark" onClick={onSaveUserProfile} />
                  <SoftMetaChip icon={Mail} text={selectedUser.profile.email} />
                  <SoftMetaChip icon={MapPin} text={selectedUser.profile.location || 'No location'} />
                  <SoftMetaChip icon={Phone} text={selectedUser.profile.phoneNumber || 'No phone'} />
                </div>
              </AdminPanel>

              <AdminPanel title="Wallet override" subtitle="Apply manual wallet adjustments and create a traceable transaction record." icon={Wallet}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <BalanceCard label="USD" value={selectedUser.wallet ? formatMoney(selectedUser.wallet.usdBalance, 'USD') : 'No wallet'} />
                  <BalanceCard label="NGN" value={selectedUser.wallet ? formatMoney(selectedUser.wallet.ngnBalance, 'NGN') : 'No wallet'} />
                  <BalanceCard label="EUR" value={selectedUser.wallet ? formatMoney(selectedUser.wallet.eurBalance, 'EUR') : 'No wallet'} />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <LabeledSelect<'USD' | 'NGN' | 'EUR'> label="Currency" value={walletCurrency} onChange={setWalletCurrency} options={[{ value: 'USD', label: 'USD' }, { value: 'NGN', label: 'NGN' }, { value: 'EUR', label: 'EUR' }]} />
                  <LabeledInput label="Adjustment amount" hint="Use negative values to remove funds" value={walletAmount} onChange={setWalletAmount} />
                  <div className="md:col-span-2">
                    <LabeledInput label="Admin note" value={walletNote} onChange={setWalletNote} />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ActionButton label="Apply wallet adjustment" tone="dark" onClick={onApplyWalletAdjustment} />
                  <SoftMetaChip icon={RefreshCw} text={selectedUser.wallet ? `Updated ${formatDate(selectedUser.wallet.updatedAt)}` : 'Wallet will be created on first adjustment'} />
                </div>
              </AdminPanel>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.95fr_1.05fr]">
              <AdminPanel title="Marketplace and partner access" subtitle="Override marketplace registration and manage partner approval without leaving the user context." icon={Store}>
                <div className="grid gap-4 md:grid-cols-2">
                  <LabeledSelect<'inherit' | 'force_unlock' | 'force_lock'>
                    label="Admin access override"
                    value={marketDraft.accessOverride}
                    onChange={(value) =>
                      setMarketDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              accessOverride: value,
                            }
                          : prev
                      )
                    }
                    options={[
                      { value: 'inherit', label: 'Use user access state' },
                      { value: 'force_unlock', label: 'Force unlock market' },
                      { value: 'force_lock', label: 'Force lock market' },
                    ]}
                  />
                  <ToggleRow
                    label="Base marketplace unlocked"
                    checked={marketDraft.isRegistered}
                    onChange={(checked) => setMarketDraft((prev) => (prev ? { ...prev, isRegistered: checked } : prev))}
                  />
                  <ToggleRow label="Show brand name" checked={marketDraft.showBrandName} onChange={(checked) => setMarketDraft((prev) => prev ? { ...prev, showBrandName: checked } : prev)} />
                  <ToggleRow label="Show phone number" checked={marketDraft.showPhoneNumber} onChange={(checked) => setMarketDraft((prev) => prev ? { ...prev, showPhoneNumber: checked } : prev)} />
                  <ToggleRow label="Show location" checked={marketDraft.showLocation} onChange={(checked) => setMarketDraft((prev) => prev ? { ...prev, showLocation: checked } : prev)} />
                  <LabeledInput label="Brand name" value={marketDraft.brandName} onChange={(value) => setMarketDraft((prev) => prev ? { ...prev, brandName: value } : prev)} />
                  <LabeledInput label="Market phone" value={marketDraft.phoneNumber} onChange={(value) => setMarketDraft((prev) => prev ? { ...prev, phoneNumber: value } : prev)} />
                  <div className="md:col-span-2">
                    <LabeledInput label="Market location" value={marketDraft.location} onChange={(value) => setMarketDraft((prev) => prev ? { ...prev, location: value } : prev)} />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ActionButton label="Save market controls" tone="dark" onClick={onSaveMarketAccess} />
                  <SoftMetaChip
                    icon={Store}
                    text={
                      selectedUser.marketSettings.accessSource === 'admin_override_unlock'
                        ? 'Live access: forced unlocked by admin'
                        : selectedUser.marketSettings.accessSource === 'admin_override_lock'
                        ? 'Live access: forced locked by admin'
                        : selectedUser.marketSettings.accessSource === 'payment'
                        ? 'Live access: unlocked by user registration'
                        : 'Live access: currently locked'
                    }
                  />
                  {selectedUser.partnerRequest ? (
                    <>
                      <ActionButton label="Approve partner request" tone="light" onClick={() => onApprovePartner(selectedUser.partnerRequest!.id)} />
                      <DangerButton label="Reject partner request" onClick={() => onRejectPartner(selectedUser.partnerRequest!.id)} />
                    </>
                  ) : (
                    <SoftMetaChip icon={BadgeCheck} text="No partner request on file" />
                  )}
                </div>
              </AdminPanel>

              <AdminPanel title="User footprint" subtitle="A wide view of what this user has touched across Connect." icon={Sparkles}>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <FootprintCard label="Comments" value={selectedUser.metrics.comments} icon={MessageSquare} />
                  <FootprintCard label="Jobs" value={selectedUser.metrics.jobs} icon={BriefcaseBusiness} />
                  <FootprintCard label="Proposals" value={selectedUser.metrics.proposals} icon={ArrowRight} />
                  <FootprintCard label="Connections" value={selectedUser.metrics.connections} icon={UserRound} />
                  <FootprintCard label="Pending requests" value={selectedUser.metrics.pendingRequests} icon={Activity} />
                  <FootprintCard
                    label="Market live"
                    value={
                      selectedUser.marketSettings.accessSource === 'admin_override_unlock'
                        ? 'Forced unlock'
                        : selectedUser.marketSettings.accessSource === 'admin_override_lock'
                        ? 'Forced lock'
                        : selectedUser.marketSettings.isRegistered
                        ? 'Unlocked'
                        : 'Locked'
                    }
                    icon={Store}
                  />
                </div>
              </AdminPanel>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel title="Posts and comments" subtitle="Moderate the user-generated feed footprint from one place." icon={MessageSquare}>
                <ListBlock title="Recent posts" empty="No recent posts for this user." items={selectedUser.posts.map((post) => ({ id: post.id, title: post.type === 'job' ? `${post.authorName} posted a job highlight` : post.authorName, subtitle: post.content, meta: formatDate(post.createdAt), actionLabel: 'Delete post', onAction: () => onDeletePost(post.id) }))} />
                <div className="mt-4">
                  <ListBlock title="Recent comments" empty="No recent comments for this user." items={selectedUser.comments.map((comment) => ({ id: comment.id, title: `Comment on post ${comment.postId}`, subtitle: comment.content, meta: formatDate(comment.createdAt), actionLabel: 'Delete comment', onAction: () => onDeleteComment(comment.id) }))} />
                </div>
              </AdminPanel>

              <AdminPanel title="Jobs and market listings" subtitle="Control the user’s commercial activity and public listings." icon={Store}>
                <ListBlock title="Jobs created" empty="No jobs created by this user." items={selectedUser.jobs.map((job) => ({ id: job.id, title: job.title, subtitle: `${job.category} • ${job.status} • ${formatMoney(job.budget, 'USD')}`, meta: formatDate(job.createdAt), actionLabel: job.status === 'open' ? 'Close job' : 'Reopen job', onAction: () => onToggleJobStatus(job.id, job.status === 'open' ? 'closed' : 'open'), secondaryLabel: 'Delete', onSecondaryAction: () => onDeleteJob(job.id) }))} />
                <div className="mt-4">
                  <ListBlock title="Market items" empty="No market items created by this user." items={selectedUser.marketItems.map((item) => ({ id: item.id, title: item.title, subtitle: `${item.category} • ${item.stockQuantity} in stock • ${formatMoney(item.price, item.priceCurrency as 'USD' | 'NGN' | 'EUR')}`, meta: formatDate(item.createdAt), actionLabel: 'Delete listing', onAction: () => onDeleteMarketItem(item.id) }))} />
                </div>
              </AdminPanel>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <AdminPanel title="Messages" subtitle="Recent direct-message footprint." icon={MessageSquare}>
                <CompactList empty="No recent messages." items={selectedUser.messages.map((message) => ({ id: message.id, title: `${message.direction === 'sent' ? 'To' : 'From'} ${message.counterpartyName}`, subtitle: message.content, meta: formatDate(message.createdAt) }))} />
              </AdminPanel>

              <AdminPanel title="Connections and requests" subtitle="Relationship graph around this account." icon={Users}>
                <CompactList empty="No recent connection requests." items={selectedUser.friendRequests.map((request) => ({ id: request.id, title: `${request.direction === 'outgoing' ? 'To' : 'From'} ${request.otherName}`, subtitle: request.status, meta: formatDate(request.createdAt) }))} />
                <div className="mt-4">
                  <CompactList empty="No active connections yet." items={selectedUser.connections.map((connection) => ({ id: connection.id, title: connection.otherName, subtitle: connection.otherUid, meta: formatDate(connection.createdAt) }))} />
                </div>
              </AdminPanel>

              <AdminPanel title="Wallet and proposals" subtitle="Financial and gig participation trail." icon={CreditCard}>
                <CompactList empty="No recent wallet transactions." items={selectedUser.walletTransactions.map((item) => ({ id: item.id, title: `${item.type} • ${formatMoney(item.amount, item.currency)}`, subtitle: `${item.method} • ${item.status}`, meta: formatDate(item.createdAt) }))} />
                <div className="mt-4">
                  <CompactList empty="No recent proposals." items={selectedUser.proposals.map((proposal) => ({ id: proposal.id, title: `Proposal for job ${proposal.jobId}`, subtitle: `${proposal.status} • ${formatMoney(proposal.budget, 'USD')}`, meta: formatDate(proposal.createdAt) }))} />
                </div>
              </AdminPanel>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p><p className="mt-2 text-sm text-slate-500">{hint}</p></div>;
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-2 text-lg font-semibold text-slate-900">{value}</p></div>;
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)]"><div className="mb-5"><h2 className="text-xl font-semibold text-slate-900">{title}</h2>{subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}</div>{children}</section>;
}

function AdminPanel({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: typeof Users; children: ReactNode }) {
  return <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"><div className="mb-5 flex items-start gap-4"><div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm"><Icon className="h-5 w-5" /></div><div><h3 className="text-lg font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div></div>{children}</div>;
}

function HeroMetric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/10 p-2.5 text-white"><Icon className="h-4 w-4" /></div><div><p className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p></div></div></div>;
}

function FootprintCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-3"><div className="rounded-2xl bg-slate-100 p-2.5 text-slate-700"><Icon className="h-4 w-4" /></div><div><p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-1 text-xl font-semibold text-slate-900">{value}</p></div></div></div>;
}

function BalanceCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-2 text-lg font-semibold text-slate-900">{value}</p></div>;
}

function LabeledInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400" />{hint ? <span className="mt-2 block text-xs text-slate-400">{hint}</span> : null}</label>;
}

function LabeledTextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400" /></label>;
}

function LabeledSelect<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: Array<{ value: T; label: string }> }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value as T)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"><span className="text-sm font-medium text-slate-800">{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5" /></label>;
}

function SoftMetaChip({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-slate-500 shadow-sm"><Icon className="h-3.5 w-3.5" />{text}</div>;
}

function ListBlock({ title, empty, items }: { title: string; empty: string; items: Array<{ id: string; title: string; subtitle: string; meta: string; actionLabel: string; onAction: () => void; secondaryLabel?: string; onSecondaryAction?: () => void }> }) {
  return <div><h4 className="mb-3 text-sm font-semibold text-slate-900">{title}</h4><div className="space-y-3">{items.length === 0 ? <EmptyState body={empty} /> : null}{items.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><p className="font-medium text-slate-900">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{item.subtitle}</p><p className="mt-2 text-xs text-slate-400">{item.meta}</p></div><div className="flex flex-wrap gap-2"><ActionButton label={item.actionLabel} tone="light" onClick={item.onAction} />{item.secondaryLabel && item.onSecondaryAction ? <DangerButton label={item.secondaryLabel} onClick={item.onSecondaryAction} /> : null}</div></div></div>)}</div></div>;
}

function CompactList({ items, empty }: { items: Array<{ id: string; title: string; subtitle: string; meta: string }>; empty: string }) {
  return <div className="space-y-3">{items.length === 0 ? <EmptyState body={empty} /> : null}{items.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="font-medium text-slate-900">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{item.subtitle}</p><p className="mt-2 text-xs text-slate-400">{item.meta}</p></div>)}</div>;
}

function Highlight({ title, body }: { title: string; body: string }) {
  return <div className="rounded-3xl border border-white/10 bg-white/5 p-4"><p className="font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></div>;
}

function FullScreenMessage({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center p-6"><div className="w-full max-w-xl rounded-[32px] border border-slate-200/80 bg-white/92 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)]"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white"><ShieldCheck className="h-8 w-8" /></div><h1 className="mt-6 text-3xl font-semibold text-slate-900">{title}</h1><p className="mt-3 text-sm leading-7 text-slate-500">{body}</p>{action ? <div className="mt-6 flex justify-center">{action}</div> : null}</div></div>;
}

function ErrorBanner({ message }: { message: string }) {
  return <div className="rounded-[24px] bg-rose-50 px-5 py-4 text-sm text-rose-700">{message}</div>;
}

function InfoBanner({ message }: { message: string }) {
  return <div className="rounded-[24px] bg-amber-50 px-5 py-4 text-sm text-amber-800">{message}</div>;
}

function EmptyState({ body }: { body: string }) {
  return <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">{body}</div>;
}

function StatusPill({ text, tone }: { text: string; tone: 'dark' | 'light' | 'success' | 'warning' | 'danger' | 'lightOnDark' }) {
  const styles = tone === 'dark' ? 'bg-slate-950 text-white' : tone === 'success' ? 'bg-emerald-100 text-emerald-700' : tone === 'warning' ? 'bg-amber-100 text-amber-700' : tone === 'danger' ? 'bg-rose-100 text-rose-700' : tone === 'lightOnDark' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles}`}>{text}</span>;
}

function ActionButton({ label, tone, onClick }: { label: string; tone: 'dark' | 'light'; onClick: () => void }) {
  return <button className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${tone === 'dark' ? 'bg-slate-950 text-white hover:bg-slate-800' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`} onClick={onClick} type="button">{label}</button>;
}

function DangerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50" onClick={onClick} type="button">{label}</button>;
}

function QuickList({ title, items }: { title: string; items: Array<{ title: string; subtitle: string; meta: string }> }) {
  return <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">{title}</h3><div className="mt-3 space-y-3">{items.length === 0 ? <p className="text-sm text-slate-500">Nothing recent here yet.</p> : null}{items.map((item, index) => <div key={`${item.title}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl bg-white px-4 py-3"><div className="min-w-0"><p className="truncate font-medium text-slate-900">{item.title}</p><p className="truncate text-sm text-slate-500">{item.subtitle}</p></div><span className="shrink-0 text-xs text-slate-400">{item.meta}</span></div>)}</div></div>;
}

export default App;

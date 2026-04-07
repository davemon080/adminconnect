import { AdminUserCommandCenter } from '../../../types';
import { EmptyState, InfoChip, Panel, StatCard, formatDate } from './shared';

export default function AccountDetailsPage({ selectedUser }: { selectedUser: AdminUserCommandCenter | null }) {
  if (!selectedUser) {
    return <EmptyState body="Select a user to open account details." />;
  }

  return (
    <div className="space-y-5">
      <Panel title="Account overview" subtitle="Core identity, status, and security snapshot for this account.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Role" value={selectedUser.profile.role} />
          <StatCard label="Market access" value={selectedUser.marketSettings.isRegistered ? 'Unlocked' : 'Locked'} />
          <StatCard label="Transaction pin" value={selectedUser.hasTransactionPin ? 'Enabled' : 'Not set'} />
          <StatCard label="Member since" value={formatDate(selectedUser.profile.createdAt)} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <InfoChip text={selectedUser.profile.publicId || selectedUser.profile.uid} />
          <InfoChip text={selectedUser.profile.email} />
          <InfoChip text={selectedUser.profile.location || 'No location'} />
          <InfoChip text={selectedUser.profile.phoneNumber || 'No phone number'} />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Profile summary" subtitle="Quick description of how this user presents inside the main app.">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-900">Display name</dt>
              <dd className="mt-1 text-slate-600">{selectedUser.profile.displayName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Status headline</dt>
              <dd className="mt-1 text-slate-600">{selectedUser.profile.status || 'No status headline yet.'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Bio</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-600">{selectedUser.profile.bio || 'No bio added yet.'}</dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Activity pulse" subtitle="High-level footprint across the major product surfaces.">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Posts" value={selectedUser.metrics.posts} />
            <StatCard label="Comments" value={selectedUser.metrics.comments} />
            <StatCard label="Messages" value={selectedUser.metrics.messages} />
            <StatCard label="Connections" value={selectedUser.metrics.connections} />
            <StatCard label="Wallet txns" value={selectedUser.metrics.walletTransactions} />
            <StatCard label="Market items" value={selectedUser.metrics.marketItems} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

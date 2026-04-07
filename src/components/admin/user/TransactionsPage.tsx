import { AdminUserCommandCenter } from '../../../types';
import { EmptyState, ListCard, Panel, formatDate, formatMoney } from './shared';

export default function TransactionsPage({ selectedUser }: { selectedUser: AdminUserCommandCenter | null }) {
  if (!selectedUser) {
    return <EmptyState body="Select a user to inspect transactions." />;
  }

  return (
    <Panel title="User transactions" subtitle="Recent wallet movement tied to this account.">
      <div className="space-y-3">
        {selectedUser.walletTransactions.length === 0 ? <EmptyState body="No recent wallet transactions." /> : null}
        {selectedUser.walletTransactions.map((item) => (
          <ListCard
            key={item.id}
            title={`${item.type} • ${formatMoney(item.amount, item.currency)}`}
            subtitle={`${item.method} • ${item.status}${item.reference ? ` • ${item.reference}` : ''}`}
            meta={formatDate(item.createdAt)}
          />
        ))}
      </div>
    </Panel>
  );
}

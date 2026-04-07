import { ShieldCheck } from 'lucide-react';
import { AdminUserCommandCenter } from '../../../types';
import { ActionButton, EmptyState, InfoChip, InputField, Panel, SelectField, StatCard, formatDate, formatMoney } from './shared';

export default function WalletManagementPage({
  selectedUser,
  walletAmount,
  setWalletAmount,
  walletCurrency,
  setWalletCurrency,
  walletNote,
  setWalletNote,
  onApplyWalletAdjustment,
}: {
  selectedUser: AdminUserCommandCenter | null;
  walletAmount: string;
  setWalletAmount: (value: string) => void;
  walletCurrency: 'USD' | 'NGN' | 'EUR';
  setWalletCurrency: (value: 'USD' | 'NGN' | 'EUR') => void;
  walletNote: string;
  setWalletNote: (value: string) => void;
  onApplyWalletAdjustment: () => void;
}) {
  if (!selectedUser) {
    return <EmptyState body="Select a user to manage wallet balances." />;
  }

  return (
    <div className="space-y-5">
      <Panel title="Wallet balances" subtitle="Current balances and security state for this user wallet.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="USD" value={selectedUser.wallet ? formatMoney(selectedUser.wallet.usdBalance, 'USD') : 'No wallet'} />
          <StatCard label="NGN" value={selectedUser.wallet ? formatMoney(selectedUser.wallet.ngnBalance, 'NGN') : 'No wallet'} />
          <StatCard label="EUR" value={selectedUser.wallet ? formatMoney(selectedUser.wallet.eurBalance, 'EUR') : 'No wallet'} />
          <StatCard label="Transaction pin" value={selectedUser.hasTransactionPin ? 'Enabled' : 'Not set'} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <InfoChip text={selectedUser.wallet ? `Updated ${formatDate(selectedUser.wallet.updatedAt)}` : 'Wallet will be created on first adjustment'} />
          <InfoChip text={selectedUser.hasTransactionPin ? 'Transfer protection is active' : 'No transfer pin active'} />
        </div>
      </Panel>

      <Panel title="Wallet management" subtitle="Apply a manual wallet adjustment and keep an admin note attached to it.">
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <SelectField<'USD' | 'NGN' | 'EUR'>
            label="Currency"
            value={walletCurrency}
            onChange={setWalletCurrency}
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'NGN', label: 'NGN' },
              { value: 'EUR', label: 'EUR' },
            ]}
          />
          <InputField label="Adjustment amount" hint="Use negative values to remove funds." value={walletAmount} onChange={setWalletAmount} />
          <div className="md:col-span-2">
            <InputField label="Admin note" value={walletNote} onChange={setWalletNote} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <ActionButton label="Apply wallet adjustment" onClick={onApplyWalletAdjustment} />
          <InfoChip text="Every adjustment writes a wallet transaction record." />
          {selectedUser.hasTransactionPin ? <InfoChip text="This user already has a transaction pin." /> : <InfoChip text="No transaction pin exists yet." />}
        </div>
      </Panel>
    </div>
  );
}

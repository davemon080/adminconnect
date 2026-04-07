import { Dispatch, SetStateAction } from 'react';
import { BadgeCheck } from 'lucide-react';
import { AdminMarketDraft, AdminUserCommandCenter } from '../../../types';
import { ActionButton, DangerButton, EmptyState, InfoChip, InputField, Panel, SelectField, ToggleField } from './shared';

export default function MarketplaceAccessPage({
  selectedUser,
  marketDraft,
  setMarketDraft,
  onSaveMarketAccess,
  onApprovePartner,
  onRejectPartner,
}: {
  selectedUser: AdminUserCommandCenter | null;
  marketDraft: AdminMarketDraft | null;
  setMarketDraft: Dispatch<SetStateAction<AdminMarketDraft | null>>;
  onSaveMarketAccess: () => void;
  onApprovePartner: (id: string) => void;
  onRejectPartner: (id: string) => void;
}) {
  if (!selectedUser || !marketDraft) {
    return <EmptyState body="Select a user to manage market and partner access." />;
  }

  return (
    <div className="space-y-5">
      <Panel title="Marketplace access" subtitle="Override registration state and adjust the exact seller visibility controls.">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField<'inherit' | 'force_unlock' | 'force_lock'>
            label="Admin access override"
            value={marketDraft.accessOverride}
            onChange={(value) => setMarketDraft((prev) => (prev ? { ...prev, accessOverride: value } : prev))}
            options={[
              { value: 'inherit', label: 'Use user access state' },
              { value: 'force_unlock', label: 'Force unlock market' },
              { value: 'force_lock', label: 'Force lock market' },
            ]}
          />
          <ToggleField label="Base marketplace unlocked" checked={marketDraft.isRegistered} onChange={(checked) => setMarketDraft((prev) => (prev ? { ...prev, isRegistered: checked } : prev))} />
          <ToggleField label="Show brand name" checked={marketDraft.showBrandName} onChange={(checked) => setMarketDraft((prev) => (prev ? { ...prev, showBrandName: checked } : prev))} />
          <ToggleField label="Show phone number" checked={marketDraft.showPhoneNumber} onChange={(checked) => setMarketDraft((prev) => (prev ? { ...prev, showPhoneNumber: checked } : prev))} />
          <ToggleField label="Show location" checked={marketDraft.showLocation} onChange={(checked) => setMarketDraft((prev) => (prev ? { ...prev, showLocation: checked } : prev))} />
          <InputField label="Brand name" value={marketDraft.brandName} onChange={(value) => setMarketDraft((prev) => (prev ? { ...prev, brandName: value } : prev))} />
          <InputField label="Market phone" value={marketDraft.phoneNumber} onChange={(value) => setMarketDraft((prev) => (prev ? { ...prev, phoneNumber: value } : prev))} />
          <div className="md:col-span-2">
            <InputField label="Market location" value={marketDraft.location} onChange={(value) => setMarketDraft((prev) => (prev ? { ...prev, location: value } : prev))} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <ActionButton label="Save market controls" onClick={onSaveMarketAccess} />
          <ActionButton label="Force unlock market" tone="light" onClick={() => setMarketDraft((prev) => (prev ? { ...prev, accessOverride: 'force_unlock' } : prev))} />
          <DangerButton label="Force lock market" onClick={() => setMarketDraft((prev) => (prev ? { ...prev, accessOverride: 'force_lock' } : prev))} />
          <InfoChip
            text={
              selectedUser.marketSettings.accessSource === 'admin_override_unlock'
                ? 'Live access: forced unlock'
                : selectedUser.marketSettings.accessSource === 'admin_override_lock'
                ? 'Live access: forced lock'
                : selectedUser.marketSettings.accessSource === 'payment'
                ? 'Live access: unlocked by payment'
                : 'Live access: currently locked'
            }
          />
        </div>
      </Panel>

      <Panel title="Partner access" subtitle="Review the company-partner request attached to this account.">
        {selectedUser.partnerRequest ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">{selectedUser.partnerRequest.companyName}</p>
                  <p className="text-sm text-slate-500">{selectedUser.partnerRequest.location} • {selectedUser.partnerRequest.status}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{selectedUser.partnerRequest.about}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ActionButton label="Approve partner request" tone="light" onClick={() => onApprovePartner(selectedUser.partnerRequest!.id)} />
              <DangerButton label="Reject partner request" onClick={() => onRejectPartner(selectedUser.partnerRequest!.id)} />
            </div>
          </div>
        ) : (
          <EmptyState body="No partner request is attached to this user." />
        )}
      </Panel>
    </div>
  );
}

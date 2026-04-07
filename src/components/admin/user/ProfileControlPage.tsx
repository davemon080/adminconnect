import { Dispatch, SetStateAction } from 'react';
import { AdminUserProfileDraft, AdminUserRole } from '../../../types';
import { ActionButton, EmptyState, InfoChip, InputField, Panel, SelectField, TextAreaField } from './shared';

export default function ProfileControlPage({
  userDraft,
  setUserDraft,
  onSaveUserProfile,
  currentEmail,
  currentLocation,
  currentPhone,
}: {
  userDraft: AdminUserProfileDraft | null;
  setUserDraft: Dispatch<SetStateAction<AdminUserProfileDraft | null>>;
  onSaveUserProfile: () => void;
  currentEmail?: string;
  currentLocation?: string;
  currentPhone?: string;
}) {
  if (!userDraft) {
    return <EmptyState body="User profile controls are not ready yet." />;
  }

  return (
    <Panel title="Profile control" subtitle="Directly update the user identity and profile fields used in the main app.">
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Display name" value={userDraft.displayName} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, displayName: value } : prev))} />
        <InputField label="Email" value={userDraft.email} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, email: value } : prev))} />
        <SelectField<AdminUserRole>
          label="Role"
          value={userDraft.role}
          onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, role: value } : prev))}
          options={[
            { value: 'freelancer', label: 'Freelancer' },
            { value: 'client', label: 'Client' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        <InputField label="Phone number" value={userDraft.phoneNumber} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, phoneNumber: value } : prev))} />
        <InputField label="Location" value={userDraft.location} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, location: value } : prev))} />
        <InputField label="Status headline" value={userDraft.status} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, status: value } : prev))} />
        <div className="md:col-span-2">
          <TextAreaField label="Bio" value={userDraft.bio} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, bio: value } : prev))} />
        </div>
        <div className="md:col-span-2">
          <InputField label="Skills" hint="Comma-separated" value={userDraft.skills} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, skills: value } : prev))} />
        </div>
        <InputField label="Company name" value={userDraft.companyName} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, companyName: value } : prev))} />
        <div className="md:col-span-2">
          <TextAreaField label="Company about" value={userDraft.companyAbout} onChange={(value) => setUserDraft((prev) => (prev ? { ...prev, companyAbout: value } : prev))} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <ActionButton label="Save profile changes" onClick={onSaveUserProfile} />
        {currentEmail ? <InfoChip text={currentEmail} /> : null}
        {currentLocation ? <InfoChip text={currentLocation} /> : null}
        {currentPhone ? <InfoChip text={currentPhone} /> : null}
      </div>
    </Panel>
  );
}

import { Dispatch, SetStateAction } from 'react';
import { BellRing, Send, Trash2 } from 'lucide-react';
import { AdminAnnouncement, AdminNotificationDraft, AdminUserProfile } from '../../types';

interface AdminNotificationsPanelProps {
  draft: AdminNotificationDraft;
  setDraft: Dispatch<SetStateAction<AdminNotificationDraft>>;
  users: AdminUserProfile[];
  notifications: AdminAnnouncement[];
  onCreate: () => void;
  onDeactivate: (id: string) => void;
  busy: boolean;
}

export default function AdminNotificationsPanel({
  draft,
  setDraft,
  users,
  notifications,
  onCreate,
  onDeactivate,
  busy,
}: AdminNotificationsPanelProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-[#dbe3f0] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)] sm:p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#202124]">Send admin notification</h3>
            <p className="mt-1 text-sm text-[#5f6368]">Push a general or individual message to the notification page, popup, or both.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Audience</span>
            <select
              value={draft.audience}
              onChange={(event) => setDraft((prev) => ({ ...prev, audience: event.target.value as 'general' | 'individual' }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            >
              <option value="general">General notification</option>
              <option value="individual">Individual user</option>
            </select>
          </label>

          {draft.audience === 'individual' ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Target user</span>
              <select
                value={draft.targetUid}
                onChange={(event) => setDraft((prev) => ({ ...prev, targetUid: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              >
                <option value="">Select a user</option>
                {users.slice(0, 200).map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.displayName} ({user.publicId || user.email})
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Delivery</span>
            <select
              value={draft.deliveryMode}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, deliveryMode: event.target.value as 'notification' | 'popup' | 'both' }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            >
              <option value="notification">Notification only</option>
              <option value="popup">Popup only</option>
              <option value="both">Notification and popup</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              placeholder="Enter notification title"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
            <textarea
              value={draft.body}
              onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))}
              className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              placeholder="Write the message users should receive"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Optional link</span>
            <input
              value={draft.link}
              onChange={(event) => setDraft((prev) => ({ ...prev, link: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              placeholder="/wallets or /settings/market"
            />
          </label>

          <button
            type="button"
            onClick={onCreate}
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {busy ? 'Sending...' : 'Send notification'}
          </button>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#dbe3f0] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)] sm:p-5">
        <div>
          <h3 className="text-lg font-semibold text-[#202124]">Recent admin notifications</h3>
          <p className="mt-1 text-sm text-[#5f6368]">Active and past messages sent across the platform.</p>
        </div>

        <div className="mt-5 space-y-3">
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dbe3f0] bg-[#f8fafd] px-5 py-8 text-center text-sm text-[#5f6368]">
              No admin notifications have been sent yet.
            </div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="rounded-3xl border border-[#dbe3f0] bg-[#f8fafd] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#202124]">{item.title}</p>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                        {item.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f6368]">{item.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#5f6368]">
                      <span>{item.targetUserName ? `To ${item.targetUserName}` : 'General'}</span>
                      <span>•</span>
                      <span>{item.deliveryMode}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {item.isActive ? (
                    <button
                      type="button"
                      onClick={() => onDeactivate(item.id)}
                      className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Deactivate
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

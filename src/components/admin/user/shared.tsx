import { ReactNode } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function formatDate(value?: string) {
  if (!value) return 'Unknown';
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return value;
  }
}

export function formatMoney(value: number, currency: 'USD' | 'NGN' | 'EUR') {
  const locale = currency === 'NGN' ? 'en-NG' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ body }: { body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
      {body}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export function InfoChip({ text }: { text: string }) {
  return <span className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">{text}</span>;
}

export function ActionButton({ label, onClick, tone = 'dark' }: { label: string; onClick: () => void; tone?: 'dark' | 'light' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
        tone === 'dark'
          ? 'bg-slate-950 text-white hover:bg-slate-800'
          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );
}

export function DangerButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
    >
      {label}
    </button>
  );
}

export function ListCard({
  title,
  subtitle,
  meta,
  actions,
}: {
  title: string;
  subtitle: string;
  meta: string;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
          <p className="mt-2 text-xs text-slate-400">{meta}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

export function InputField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />
      {hint ? <span className="mt-2 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5" />
    </label>
  );
}

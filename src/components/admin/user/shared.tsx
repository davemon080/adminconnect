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
    <section className="rounded-3xl border border-[#dbe3f0] bg-[#f8fafd] p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.08)] sm:p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-[#202124]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#5f6368]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ body }: { body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#dbe3f0] bg-white px-4 py-7 text-center text-sm text-[#5f6368]">
      {body}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] border border-[#dbe3f0] bg-white p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#5f6368]">{label}</p>
      <p className="mt-1.5 text-lg font-semibold text-[#202124]">{value}</p>
    </div>
  );
}

export function InfoChip({ text }: { text: string }) {
  return <span className="inline-flex rounded-full border border-[#d2e3fc] bg-[#e8f0fe] px-3 py-1.5 text-[11px] font-medium text-[#1967d2]">{text}</span>;
}

export function ActionButton({ label, onClick, tone = 'dark' }: { label: string; onClick: () => void; tone?: 'dark' | 'light' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
        tone === 'dark'
          ? 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'
          : 'border border-[#dbe3f0] bg-white text-[#3c4043] hover:bg-[#f8fafd]'
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
      className="rounded-2xl border border-[#f5c2c7] bg-white px-4 py-2.5 text-sm font-medium text-[#b3261e] transition hover:bg-[#fce8e6]"
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
    <div className="rounded-[22px] border border-[#dbe3f0] bg-white p-3.5 shadow-[0_1px_2px_rgba(60,64,67,0.08)]">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#202124]">{title}</p>
          <p className="mt-1 text-sm leading-5 text-[#5f6368]">{subtitle}</p>
          <p className="mt-2 text-[11px] text-[#80868b]">{meta}</p>
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
      <span className="mb-2 block text-sm font-medium text-[#3c4043]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[#dbe3f0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe]"
      />
      {hint ? <span className="mt-2 block text-[11px] text-[#80868b]">{hint}</span> : null}
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
      <span className="mb-2 block text-sm font-medium text-[#3c4043]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[112px] w-full rounded-2xl border border-[#dbe3f0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe]"
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
      <span className="mb-2 block text-sm font-medium text-[#3c4043]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-2xl border border-[#dbe3f0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe]"
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
    <label className="flex items-center justify-between rounded-2xl border border-[#dbe3f0] bg-white px-4 py-3.5">
      <span className="text-sm font-medium text-[#3c4043]">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5" />
    </label>
  );
}

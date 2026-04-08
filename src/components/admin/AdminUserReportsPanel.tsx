import { Flag, ShieldCheck } from 'lucide-react';
import { AdminUserReport } from '../../types';

interface AdminUserReportsPanelProps {
  reports: AdminUserReport[];
  onUpdateStatus: (report: AdminUserReport, status: AdminUserReport['status']) => void;
}

export default function AdminUserReportsPanel({ reports, onUpdateStatus }: AdminUserReportsPanelProps) {
  return (
    <section className="rounded-[28px] border border-[#dbe3f0] bg-white p-4 shadow-[0_1px_2px_rgba(60,64,67,0.08)] sm:p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-red-50 p-3 text-red-600">
          <Flag className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#202124]">Reported users</h3>
          <p className="mt-1 text-sm text-[#5f6368]">Review reports coming from the main app and update their moderation state.</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {reports.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#dbe3f0] bg-[#f8fafd] px-5 py-8 text-center text-sm text-[#5f6368]">
            No user reports have been submitted yet.
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="rounded-3xl border border-[#dbe3f0] bg-[#f8fafd] p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#202124]">{report.reportedName}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      report.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : report.status === 'dismissed'
                        ? 'bg-gray-200 text-gray-700'
                        : report.status === 'reviewing'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#5f6368]">
                    Reported by <span className="font-semibold text-[#202124]">{report.reporterName}</span>
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#202124]">Reason: {report.reason}</p>
                  {report.details ? <p className="mt-2 text-sm leading-6 text-[#5f6368]">{report.details}</p> : null}
                  {report.adminNote ? <p className="mt-2 rounded-2xl bg-white px-3 py-2 text-xs text-[#5f6368]">Admin note: {report.adminNote}</p> : null}
                  <p className="mt-3 text-[11px] text-[#80868b]">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.status !== 'reviewing' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(report, 'reviewing')}
                      className="rounded-2xl border border-[#dbe3f0] bg-white px-4 py-2.5 text-sm font-medium text-[#3c4043] hover:bg-[#f8fafd]"
                    >
                      Mark reviewing
                    </button>
                  ) : null}
                  {report.status !== 'resolved' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(report, 'resolved')}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Resolve
                    </button>
                  ) : null}
                  {report.status !== 'dismissed' ? (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(report, 'dismissed')}
                      className="rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Dismiss
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

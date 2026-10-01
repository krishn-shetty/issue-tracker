import { ISSUE_STATUSES, STATUS_LABELS } from "../../issues/constants";

const SEGMENT_COLORS = { OPEN: "bg-blue-500", IN_PROGRESS: "bg-amber-500", CLOSED: "bg-emerald-500" };

function toPercent(count, total) {
  return total > 0 ? Math.round(count / total * 100) : 0;
}

export function StatusBreakdown({ breakdown, total }) {
  const segments = ISSUE_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: breakdown?.[status] ?? 0
  }));

  return (
    <section aria-labelledby="status-breakdown-heading" className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 id="status-breakdown-heading" className="text-base font-semibold text-slate-900">Status breakdown</h2>
      <p className="mt-1 text-sm text-slate-600">{total} {total === 1 ? "issue" : "issues"} in total</p>

      <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        {segments.map((segment) =>
        segment.count > 0 ?
        <div key={segment.status} className={SEGMENT_COLORS[segment.status]} style={{ width: `${segment.count / total * 100}%` }} /> :
        null
        )}
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        {segments.map((segment) =>
        <div key={segment.status} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-slate-700">
              <span className={`h-2.5 w-2.5 rounded-sm ${SEGMENT_COLORS[segment.status]}`} aria-hidden="true" />
              {segment.label}
            </dt>
            <dd className="tabular-nums text-slate-900">
              <span className="font-medium">{segment.count}</span>
              <span className="ml-2 text-slate-500">{toPercent(segment.count, total)}%</span>
            </dd>
          </div>
        )}
      </dl>
    </section>);

}
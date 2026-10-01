import { formatDate, formatDateTime } from "../../../lib/format";

export function IssueMeta({ issue }) {
  const rows = [
  { label: "Assignee", value: issue.assignedTo?.name ?? "Unassigned", muted: !issue.assignedTo },
  { label: "Created By", value: issue.createdBy?.name ?? "Unknown user", muted: !issue.createdBy },
  { label: "Created", value: formatDate(issue.createdAt), dateTime: issue.createdAt },
  { label: "Updated", value: formatDate(issue.updatedAt), dateTime: issue.updatedAt }];


  return (
    <section aria-labelledby="issue-details-heading" className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 id="issue-details-heading" className="text-sm font-semibold text-slate-900">Details</h2>
      <dl className="mt-3 divide-y divide-slate-100 text-sm">
        {rows.map((row) =>
        <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="shrink-0 text-slate-600">{row.label}</dt>
            <dd className={`min-w-0 truncate text-right font-medium ${row.muted ? "text-slate-500" : "text-slate-900"}`} title={row.dateTime ? formatDateTime(row.dateTime) : row.value}>
              {row.dateTime ? <time dateTime={row.dateTime}>{row.value}</time> : row.value}
            </dd>
          </div>
        )}
      </dl>
    </section>);

}
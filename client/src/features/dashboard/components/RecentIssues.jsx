import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PriorityBadge, StatusBadge } from "../../../components/Badge";
import { EmptyState } from "../../../components/EmptyState";
import { buttonClasses } from "../../../components/Button";
import { formatDate, formatDateTime } from "../../../lib/format";

export function RecentIssues({ issues, className = "" }) {
  return (
    <section aria-labelledby="recent-issues-heading" className={`rounded-xl border border-slate-200 bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 id="recent-issues-heading" className="text-base font-semibold text-slate-900">Recent Issues</h2>
        <Link to="/issues" className="rounded text-sm font-medium text-indigo-700 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          View all
        </Link>
      </div>
      {issues.length === 0 ?
      <EmptyState
        title="No issues found."
        description="Create your first issue."
        action={
        <Link to="/issues/new" className={buttonClasses()}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Issue
            </Link>
        } /> :


      <ul className="divide-y divide-slate-100">
          {issues.map((issue) =>
        <li key={issue.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <Link
              to={`/issues/${issue.id}`}
              title={issue.title}
              className="block truncate rounded text-sm font-medium text-slate-900 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              
                  {issue.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {issue.assignedTo?.name ?? "Unassigned"} ·{" "}
                  <time dateTime={issue.createdAt} title={formatDateTime(issue.createdAt)}>{formatDate(issue.createdAt)}</time>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
              </div>
            </li>
        )}
        </ul>
      }
    </section>);

}
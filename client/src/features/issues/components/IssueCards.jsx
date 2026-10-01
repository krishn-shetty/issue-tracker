import { Link } from "react-router-dom";
import { PriorityBadge, StatusBadge } from "../../../components/Badge";
import { formatDate, formatDateTime } from "../../../lib/format";
import { IssueRowActions } from "./IssueRowActions";

export function IssueCards({ issues, user, onDelete, className = "" }) {
  return (
    <ul aria-label="Issues" className={`space-y-3 ${className}`}>
      {issues.map((issue) =>
      <li key={issue.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <Link
            to={`/issues/${issue.id}`}
            className="min-w-0 break-words rounded font-medium text-slate-900 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            
              {issue.title}
            </Link>
            <IssueRowActions issue={issue} user={user} onDelete={onDelete} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
            <div className="min-w-0">
              <dt className="text-slate-500">Assignee</dt>
              <dd className="truncate font-medium text-slate-700">{issue.assignedTo?.name ?? "Unassigned"}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-slate-500">Created by</dt>
              <dd className="truncate font-medium text-slate-700">{issue.createdBy?.name ?? "Unknown user"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium text-slate-700">
                <time dateTime={issue.createdAt} title={formatDateTime(issue.createdAt)}>{formatDate(issue.createdAt)}</time>
              </dd>
            </div>
          </dl>
        </li>
      )}
    </ul>);

}
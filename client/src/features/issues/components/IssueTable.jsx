import { Link } from "react-router-dom";
import { PriorityBadge, StatusBadge } from "../../../components/Badge";
import { formatDate, formatDateTime } from "../../../lib/format";
import { IssueRowActions } from "./IssueRowActions";

const HEADER_CELL = "px-4 py-3 font-medium";

export function IssueTable({ issues, user, onDelete, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${className}`}>
      <table className="w-full table-fixed text-left text-sm">
        <caption className="sr-only">Issues</caption>
        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
          <tr>
            <th scope="col" className={`${HEADER_CELL} w-[30%]`}>Title</th>
            <th scope="col" className={`${HEADER_CELL} w-32`}>Status</th>
            <th scope="col" className={`${HEADER_CELL} w-28`}>Priority</th>
            <th scope="col" className={HEADER_CELL}>Assignee</th>
            <th scope="col" className={HEADER_CELL}>Created By</th>
            <th scope="col" className={`${HEADER_CELL} w-28`}>Created</th>
            <th scope="col" className={`${HEADER_CELL} w-32 text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {issues.map((issue) => {
            const assignee = issue.assignedTo?.name ?? "Unassigned";
            const creator = issue.createdBy?.name ?? "Unknown user";
            return (
              <tr key={issue.id} className="transition-colors duration-150 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    to={`/issues/${issue.id}`}
                    title={issue.title}
                    className="block truncate rounded font-medium text-slate-900 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    
                    {issue.title}
                  </Link>
                </td>
                <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={issue.priority} /></td>
                <td className="px-4 py-3">
                  <span className={`block truncate ${issue.assignedTo ? "text-slate-700" : "text-slate-500"}`} title={assignee}>
                    {assignee}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="block truncate text-slate-700" title={creator}>{creator}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <time dateTime={issue.createdAt} title={formatDateTime(issue.createdAt)}>{formatDate(issue.createdAt)}</time>
                </td>
                <td className="px-4 py-2">
                  <IssueRowActions issue={issue} user={user} onDelete={onDelete} />
                </td>
              </tr>);

          })}
        </tbody>
      </table>
    </div>);

}
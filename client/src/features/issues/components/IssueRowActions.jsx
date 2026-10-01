import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { buttonClasses } from "../../../components/Button";
import { canManageIssue } from "../permissions";

const ICON_LINK = buttonClasses({ variant: "ghost", size: "icon" });
const ICON_DELETE = buttonClasses({ variant: "dangerGhost", size: "icon" });

export function IssueRowActions({ issue, user, onDelete }) {
  const canManage = canManageIssue(issue, user);

  return (
    <div className="flex shrink-0 items-center justify-end gap-1">
      <Link to={`/issues/${issue.id}`} className={ICON_LINK} aria-label={`View issue: ${issue.title}`} title="View">
        <Eye className="h-4 w-4" aria-hidden="true" />
      </Link>
      {canManage &&
      <>
          <Link to={`/issues/${issue.id}/edit`} className={ICON_LINK} aria-label={`Edit issue: ${issue.title}`} title="Edit">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
          type="button"
          className={ICON_DELETE}
          onClick={() => onDelete(issue)}
          aria-label={`Delete issue: ${issue.title}`}
          title="Delete">
          
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      }
    </div>);

}
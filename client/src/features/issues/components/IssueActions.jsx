import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { FormField } from "../../../components/FormField";
import { Select } from "../../../components/Select";
import { Button, buttonClasses } from "../../../components/Button";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { useAssignableUsers } from "../../users/hooks";
import { useChangeIssueAssignee, useChangeIssueStatus, useDeleteIssue } from "../hooks";
import { canChangeIssueStatus, canManageIssue } from "../permissions";
import { STATUS_OPTIONS } from "../constants";
import { AssigneeOptions } from "./AssigneeOptions";

export function IssueActions({ issue, user }) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const changeStatus = useChangeIssueStatus();
  const changeAssignee = useChangeIssueAssignee();
  const deleteIssue = useDeleteIssue();
  const canManage = canManageIssue(issue, user);
  const canUpdateStatus = canChangeIssueStatus(issue, user);
  const { data: usersData } = useAssignableUsers();

  if (!canManage && !canUpdateStatus) {
    return (
      <section aria-label="Actions" className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Only the creator, the assignee or an admin can change this issue.
      </section>);

  }

  function handleDelete() {
    deleteIssue.mutate(issue.id, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        navigate("/issues", { replace: true });
      }
    });
  }

  return (
    <section aria-labelledby="issue-actions-heading" className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h2 id="issue-actions-heading" className="text-sm font-semibold text-slate-900">Actions</h2>

      {canUpdateStatus &&
      <FormField label="Status" hint={changeStatus.isPending ? "Saving..." : undefined}>
          {(field) =>
        <Select
          {...field}
          value={issue.status}
          disabled={changeStatus.isPending}
          onChange={(event) => changeStatus.mutate({ id: issue.id, status: event.target.value })}>
          
              {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
        }
        </FormField>
      }

      {canManage &&
      <FormField label="Assignee" hint={changeAssignee.isPending ? "Saving..." : undefined}>
          {(field) =>
        <Select
          {...field}
          value={issue.assignedTo?.id ?? ""}
          disabled={changeAssignee.isPending}
          onChange={(event) => changeAssignee.mutate({ id: issue.id, assignedTo: event.target.value || null })}>
          
              <AssigneeOptions users={usersData?.items} currentAssignee={issue.assignedTo} />
            </Select>
        }
        </FormField>
      }

      {canManage &&
      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
          <Link to={`/issues/${issue.id}/edit`} className={buttonClasses({ variant: "secondary" })}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
          <Button variant="dangerOutline" onClick={() => setIsConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      }

      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete Issue?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isPending={deleteIssue.isPending} />
      
    </section>);

}
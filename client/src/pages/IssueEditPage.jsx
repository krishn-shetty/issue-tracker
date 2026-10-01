import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { buttonClasses } from "../components/Button";
import { IssueForm } from "../features/issues/components/IssueForm";
import { IssueNotFound } from "../features/issues/components/IssueNotFound";
import { IssueQueryFallback } from "../features/issues/components/IssueQueryFallback";
import { useIssue, useUpdateIssue } from "../features/issues/hooks";
import { getChangedIssueFields, toIssueFormValues } from "../features/issues/schemas";
import { canManageIssue } from "../features/issues/permissions";
import { isValidObjectId } from "../features/issues/constants";
import { useCurrentUser } from "../features/auth/hooks";
import { applyServerFieldErrors } from "../lib/errors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function IssueEditPage() {
  useDocumentTitle("Edit Issue");
  const { id } = useParams();
  const navigate = useNavigate();
  const isValidId = isValidObjectId(id);
  const issueQuery = useIssue(id, { enabled: isValidId });
  const { data: user } = useCurrentUser();
  const updateIssue = useUpdateIssue();
  const issue = issueQuery.data;

  if (!isValidId) return <IssueNotFound />;
  if (!issue) return <IssueQueryFallback query={issueQuery} />;

  const detailPath = `/issues/${issue.id}`;

  if (!canManageIssue(issue, user)) {
    return (
      <EmptyState
        className="rounded-xl border border-slate-200 bg-white py-16"
        icon={Lock}
        title="You don't have permission to edit this issue."
        description="Only the issue's creator or an admin can edit it."
        action={<Link to={detailPath} className={buttonClasses({ variant: "secondary" })}>Back to issue</Link>} />);


  }

  function handleSubmit(values, { setError }) {
    const changes = getChangedIssueFields(values, issue);
    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save.");
      navigate(detailPath);
      return;
    }
    updateIssue.mutate(
      { id: issue.id, changes },
      { onSuccess: () => navigate(detailPath), onError: (error) => applyServerFieldErrors(error, setError) }
    );
  }

  return (
    <>
      <PageHeader title="Edit issue" description={issue.title} backTo={detailPath} backLabel="Back to issue" />
      <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <IssueForm
          key={issue.id}
          defaultValues={toIssueFormValues(issue)}
          currentAssignee={issue.assignedTo}
          onSubmit={handleSubmit}
          isPending={updateIssue.isPending}
          submitLabel="Save changes"
          pendingLabel="Saving..."
          cancelTo={detailPath} />
        
      </div>
    </>);

}
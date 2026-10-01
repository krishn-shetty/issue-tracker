import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { IssueForm } from "../features/issues/components/IssueForm";
import { useCreateIssue } from "../features/issues/hooks";
import { toIssuePayload } from "../features/issues/schemas";
import { DEFAULT_ISSUE_FORM_VALUES } from "../features/issues/constants";
import { applyServerFieldErrors } from "../lib/errors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function IssueCreatePage() {
  useDocumentTitle("Create Issue");
  const navigate = useNavigate();
  const createIssue = useCreateIssue();

  function handleSubmit(values, { setError }) {
    createIssue.mutate(toIssuePayload(values), {
      onSuccess: (issue) => navigate(`/issues/${issue.id}`),
      onError: (error) => applyServerFieldErrors(error, setError)
    });
  }

  return (
    <>
      <PageHeader
        title="Create issue"
        description="Describe the problem clearly so the right person can pick it up."
        backTo="/issues"
        backLabel="Back to issues" />
      
      <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <IssueForm
          defaultValues={DEFAULT_ISSUE_FORM_VALUES}
          onSubmit={handleSubmit}
          isPending={createIssue.isPending}
          submitLabel="Create Issue"
          pendingLabel="Creating..."
          cancelTo="/issues" />
        
      </div>
    </>);

}
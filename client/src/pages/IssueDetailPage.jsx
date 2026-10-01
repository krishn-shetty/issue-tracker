import { useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { PriorityBadge, StatusBadge } from "../components/Badge";
import { IssueActions } from "../features/issues/components/IssueActions";
import { IssueMeta } from "../features/issues/components/IssueMeta";
import { IssueNotFound } from "../features/issues/components/IssueNotFound";
import { IssueQueryFallback } from "../features/issues/components/IssueQueryFallback";
import { CommentList } from "../features/comments/components/CommentList";
import { useIssue } from "../features/issues/hooks";
import { isValidObjectId } from "../features/issues/constants";
import { useCurrentUser } from "../features/auth/hooks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function IssueDetailPage() {
  const { id } = useParams();
  const isValidId = isValidObjectId(id);
  const issueQuery = useIssue(id, { enabled: isValidId });
  const { data: user } = useCurrentUser();
  const issue = issueQuery.data;
  useDocumentTitle(issue?.title ?? "Issue");

  if (!isValidId) return <IssueNotFound />;
  if (!issue) return <IssueQueryFallback query={issueQuery} />;

  return (
    <>
      <PageHeader
        title={issue.title}
        backTo="/issues"
        backLabel="Back to issues"
        meta={
        <>
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </>
        } />
      
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <aside className="space-y-6 lg:col-start-2 lg:row-start-1">
          <IssueActions issue={issue} user={user} />
          <IssueMeta issue={issue} />
        </aside>
        <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
          <section aria-labelledby="issue-description-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 id="issue-description-heading" className="text-base font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{issue.description}</p>
          </section>
          <CommentList issueId={issue.id} user={user} />
        </div>
      </div>
    </>);

}
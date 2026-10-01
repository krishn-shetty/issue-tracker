import { Spinner } from "../../../components/Spinner";
import { ErrorState } from "../../../components/ErrorState";
import { applyServerFieldErrors, getErrorMessage } from "../../../lib/errors";
import { useComments, useCreateComment } from "../hooks";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";

function CommentsBody({ query, issueId, user }) {
  if (query.isPending) return <Spinner label="Loading comments..." className="py-8" />;
  if (query.isError) {
    return (
      <ErrorState
        title="Unable to load comments."
        message={getErrorMessage(query.error)}
        onRetry={query.refetch}
        isRetrying={query.isRefetching}
        className="py-8" />);


  }

  const { items, pagination } = query.data;
  if (items.length === 0) {
    return <p className="py-6 text-sm text-slate-600">No comments yet. Be the first to comment.</p>;
  }

  return (
    <>
      <ul className="divide-y divide-slate-100">
        {items.map((comment) =>
        <CommentItem key={comment.id} comment={comment} issueId={issueId} user={user} />
        )}
      </ul>
      {pagination?.total > items.length &&
      <p className="pb-2 text-xs text-slate-500">
          Showing the first {items.length} of {pagination.total} comments.
        </p>
      }
    </>);

}

export function CommentList({ issueId, user }) {
  const commentsQuery = useComments(issueId);
  const createComment = useCreateComment(issueId);
  const total = commentsQuery.data?.pagination?.total;

  function handleCreate(content, { reset, setError }) {
    createComment.mutate(
      { issueId, content },
      { onSuccess: reset, onError: (error) => applyServerFieldErrors(error, setError) }
    );
  }

  return (
    <section aria-labelledby="comments-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 id="comments-heading" className="text-base font-semibold text-slate-900">
        Comments
        {typeof total === "number" && <span className="ml-2 text-sm font-normal text-slate-500">{total}</span>}
      </h2>
      <div aria-live="polite">
        <CommentsBody query={commentsQuery} issueId={issueId} user={user} />
      </div>
      <div className="mt-2 border-t border-slate-100 pt-4">
        <CommentForm
          label="Add a comment"
          placeholder="Write a comment..."
          submitLabel="Add Comment"
          pendingLabel="Adding..."
          isPending={createComment.isPending}
          onSubmit={handleCreate} />
        
      </div>
    </section>);

}
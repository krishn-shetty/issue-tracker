import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { Button } from "../../../components/Button";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { applyServerFieldErrors } from "../../../lib/errors";
import { formatDateTime, formatRelativeTime, isEdited } from "../../../lib/format";
import { useDeleteComment, useUpdateComment } from "../hooks";
import { canDeleteComment, canEditComment } from "../permissions";
import { CommentForm } from "./CommentForm";

export function CommentItem({ comment, issueId, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const updateComment = useUpdateComment(issueId);
  const deleteComment = useDeleteComment(issueId);
  const canEdit = canEditComment(comment, user);
  const canDelete = canDeleteComment(comment, user);
  const authorName = comment.author?.name ?? "Unknown user";

  function handleUpdate(content, { setError }) {
    if (content === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment.mutate(
      { id: comment.id, content },
      { onSuccess: () => setIsEditing(false), onError: (error) => applyServerFieldErrors(error, setError) }
    );
  }

  function handleDelete() {
    deleteComment.mutate(comment.id, { onSuccess: () => setIsConfirmOpen(false) });
  }

  return (
    <li className="flex gap-3 py-4">
      <Avatar name={authorName} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-slate-900">{authorName}</span>
          <time dateTime={comment.createdAt} title={formatDateTime(comment.createdAt)} className="text-xs text-slate-500">
            {formatRelativeTime(comment.createdAt)}
          </time>
          {isEdited(comment.createdAt, comment.updatedAt) &&
          <span className="text-xs text-slate-500" title={`Edited ${formatDateTime(comment.updatedAt)}`}>(edited)</span>
          }
          {!isEditing && (canEdit || canDelete) &&
          <div className="ml-auto flex gap-1">
              {canEdit &&
            <Button variant="ghost" size="sm" className="px-2" onClick={() => setIsEditing(true)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Button>
            }
              {canDelete &&
            <Button variant="dangerGhost" size="sm" className="px-2" onClick={() => setIsConfirmOpen(true)}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </Button>
            }
            </div>
          }
        </div>
        {isEditing ?
        <div className="mt-2">
            <CommentForm
            label="Edit comment"
            defaultValue={comment.content}
            submitLabel="Save"
            pendingLabel="Saving..."
            isPending={updateComment.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            autoFocus />
          
          </div> :

        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{comment.content}</p>
        }
      </div>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Delete comment?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isPending={deleteComment.isPending} />
      
    </li>);

}
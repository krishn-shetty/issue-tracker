import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createComment, deleteComment, getComments, updateComment } from "./api";
import { queryKeys } from "../../lib/queryKeys";
import { getErrorMessage } from "../../lib/errors";

// Server maximum page size for comments.
const COMMENTS_PARAMS = { limit: 100 };

export function useComments(issueId) {
  return useQuery({
    queryKey: queryKeys.comments.list(issueId),
    queryFn: () => getComments(issueId, COMMENTS_PARAMS),
    enabled: Boolean(issueId)
  });
}

function useCommentMutation(issueId, mutationFn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(issueId) });
      toast.success(successMessage);
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });
}

export function useCreateComment(issueId) {
  return useCommentMutation(issueId, createComment, "Comment added.");
}

export function useUpdateComment(issueId) {
  return useCommentMutation(issueId, updateComment, "Comment updated.");
}

export function useDeleteComment(issueId) {
  return useCommentMutation(issueId, deleteComment, "Comment deleted.");
}
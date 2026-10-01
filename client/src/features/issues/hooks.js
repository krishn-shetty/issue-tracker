import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changeIssueAssignee,
  changeIssueStatus,
  createIssue,
  deleteIssue,
  getIssue,
  getIssues,
  updateIssue } from
"./api";
import { queryKeys } from "../../lib/queryKeys";
import { getErrorMessage } from "../../lib/errors";

export function useIssues(params) {
  return useQuery({
    queryKey: queryKeys.issues.list(params),
    queryFn: () => getIssues(params),
    placeholderData: keepPreviousData
  });
}

export function useIssue(id, { enabled = true } = {}) {
  return useQuery({
    queryKey: queryKeys.issues.detail(id),
    queryFn: () => getIssue(id),
    enabled: enabled && Boolean(id)
  });
}

function cacheIssue(queryClient, issue) {
  queryClient.setQueryData(queryKeys.issues.detail(issue.id), issue);
}

function forgetIssue(queryClient, _data, id) {
  queryClient.removeQueries({ queryKey: queryKeys.issues.detail(id), exact: true });
  queryClient.removeQueries({ queryKey: queryKeys.comments.list(id) });
}

function useIssueMutation({ mutationFn, successMessage, updateCache }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      updateCache(queryClient, data, variables);
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
      toast.success(successMessage);
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });
}

export function useCreateIssue() {
  return useIssueMutation({ mutationFn: createIssue, successMessage: "Issue created successfully.", updateCache: cacheIssue });
}

export function useUpdateIssue() {
  return useIssueMutation({ mutationFn: updateIssue, successMessage: "Issue updated successfully.", updateCache: cacheIssue });
}

export function useDeleteIssue() {
  return useIssueMutation({ mutationFn: deleteIssue, successMessage: "Issue deleted successfully.", updateCache: forgetIssue });
}

export function useChangeIssueStatus() {
  return useIssueMutation({ mutationFn: changeIssueStatus, successMessage: "Status updated.", updateCache: cacheIssue });
}

export function useChangeIssueAssignee() {
  return useIssueMutation({ mutationFn: changeIssueAssignee, successMessage: "Assignee updated.", updateCache: cacheIssue });
}
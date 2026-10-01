import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Spinner } from "../components/Spinner";
import { buttonClasses } from "../components/Button";
import { IssueFilters } from "../features/issues/components/IssueFilters";
import { IssueResults } from "../features/issues/components/IssueResults";
import { buildIssueQueryParams, useIssueSearchParams } from "../features/issues/useIssueSearchParams";
import { useDeleteIssue, useIssues } from "../features/issues/hooks";
import { useCurrentUser } from "../features/auth/hooks";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function IssuesPage() {
  useDocumentTitle("Issues");
  const { filters, setFilter, setPage, clearFilters, hasActiveFilters } = useIssueSearchParams();
  const { data: user } = useCurrentUser();
  const issuesQuery = useIssues(buildIssueQueryParams(filters));
  const deleteIssue = useDeleteIssue();
  const [issueToDelete, setIssueToDelete] = useState(null);

  const pagination = issuesQuery.data?.pagination;
  const lastPage = Math.max(pagination?.pages ?? 1, 1);
  const isPageOutOfRange = Boolean(pagination) && !issuesQuery.isPlaceholderData && filters.page > lastPage;

  // Clamp e.g. ?page=99 or a page that became empty after a delete.
  useEffect(() => {
    if (isPageOutOfRange) setPage(lastPage, { replace: true });
  }, [isPageOutOfRange, lastPage, setPage]);

  function handlePageChange(page) {
    setPage(page);
    window.scrollTo({ top: 0 });
  }

  function handleConfirmDelete() {
    deleteIssue.mutate(issueToDelete.id, { onSuccess: () => setIssueToDelete(null) });
  }

  const showPagination = pagination?.total > 0 && !issuesQuery.isError && !isPageOutOfRange;

  return (
    <>
      <PageHeader
        title="Issues"
        description="Search, filter and manage every issue in the workspace."
        actions={
        <Link to="/issues/new" className={buttonClasses()}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Issue
          </Link>
        } />
      
      <div className="space-y-4">
        <IssueFilters filters={filters} onFilterChange={setFilter} onClear={clearFilters} hasActiveFilters={hasActiveFilters} />
        {isPageOutOfRange ?
        <Spinner label="Loading..." className="rounded-xl border border-slate-200 bg-white py-16" /> :

        <IssueResults
          query={issuesQuery}
          user={user}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onDelete={setIssueToDelete} />

        }
        {showPagination &&
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPageChange={handlePageChange}
          itemLabel="issue" />

        }
      </div>
      <ConfirmDialog
        open={Boolean(issueToDelete)}
        title="Delete Issue?"
        description="This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIssueToDelete(null)}
        isPending={deleteIssue.isPending} />
      
    </>);

}
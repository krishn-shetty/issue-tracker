import { Link } from "react-router-dom";
import { Plus, SearchX } from "lucide-react";
import { Spinner } from "../../../components/Spinner";
import { ErrorState } from "../../../components/ErrorState";
import { EmptyState } from "../../../components/EmptyState";
import { Button, buttonClasses } from "../../../components/Button";
import { getErrorMessage } from "../../../lib/errors";
import { IssueTable } from "./IssueTable";
import { IssueCards } from "./IssueCards";

const PANEL = "rounded-xl border border-slate-200 bg-white";

export function IssueResults({ query, user, hasActiveFilters, onClearFilters, onDelete }) {
  const { data, isPending, isError, error, refetch, isRefetching, isFetching, isPlaceholderData } = query;

  if (isPending) return <Spinner label="Loading..." className={`${PANEL} py-16`} />;

  if (isError) {
    return (
      <ErrorState
        className={PANEL}
        title="Unable to load issues."
        message={getErrorMessage(error)}
        onRetry={refetch}
        isRetrying={isRefetching} />);


  }

  if (data.items.length === 0) {
    return hasActiveFilters ?
    <EmptyState
      className={PANEL}
      icon={SearchX}
      title="No issues match your filters."
      description="Try a different search term or clear the filters."
      action={<Button variant="secondary" onClick={onClearFilters}>Clear filters</Button>} /> :


    <EmptyState
      className={PANEL}
      title="No issues found."
      description="Create your first issue."
      action={
      <Link to="/issues/new" className={buttonClasses()}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Issue
          </Link>
      } />;


  }

  const isUpdating = isFetching && isPlaceholderData;

  return (
    <div aria-busy={isUpdating} className={`transition-opacity duration-150 ${isUpdating ? "opacity-60" : "opacity-100"}`}>
      <IssueTable issues={data.items} user={user} onDelete={onDelete} className="hidden lg:block" />
      <IssueCards issues={data.items} user={user} onDelete={onDelete} className="lg:hidden" />
    </div>);

}
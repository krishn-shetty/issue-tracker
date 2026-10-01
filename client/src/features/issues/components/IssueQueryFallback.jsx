import { Spinner } from "../../../components/Spinner";
import { ErrorState } from "../../../components/ErrorState";
import { getErrorMessage } from "../../../lib/errors";
import { IssueNotFound } from "./IssueNotFound";

const PANEL = "rounded-xl border border-slate-200 bg-white";
const NOT_FOUND_STATUSES = [400, 404];

// Loading / not-found / forbidden / error states for a single-issue query without data.
export function IssueQueryFallback({ query }) {
  if (query.isPending) return <Spinner label="Loading issue..." className="py-24" />;

  const status = query.error?.status;
  if (NOT_FOUND_STATUSES.includes(status)) return <IssueNotFound />;

  if (status === 403) {
    return (
      <ErrorState
        className={PANEL}
        title="You don't have permission to view this issue."
        message="Ask the issue's creator or an admin for access." />);


  }

  return (
    <ErrorState
      className={PANEL}
      title="Unable to load this issue."
      message={getErrorMessage(query.error)}
      onRetry={query.refetch}
      isRetrying={query.isRefetching} />);


}
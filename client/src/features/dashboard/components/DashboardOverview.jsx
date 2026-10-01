import { CircleCheck, CircleDot, Clock, Layers, UserRound } from "lucide-react";
import { Skeleton } from "../../../components/Skeleton";
import { ErrorState } from "../../../components/ErrorState";
import { getErrorMessage } from "../../../lib/errors";
import { useDashboardSummary } from "../hooks";
import { StatCard } from "./StatCard";
import { RecentIssues } from "./RecentIssues";
import { StatusBreakdown } from "./StatusBreakdown";

const SKELETON_CARDS = 5;

function buildCards(summary) {
  return [
  { label: "Total Issues", value: summary.totalIssues, icon: Layers, to: "/issues" },
  { label: "Open", value: summary.openIssues, icon: CircleDot, to: "/issues?status=OPEN" },
  { label: "In Progress", value: summary.inProgressIssues, icon: Clock, to: "/issues?status=IN_PROGRESS" },
  { label: "Closed", value: summary.closedIssues, icon: CircleCheck, to: "/issues?status=CLOSED" },
  {
    label: "My Issues",
    value: summary.myIssues,
    icon: UserRound,
    caption: "Assigned to or created by you",
    emphasis: true,
    className: "col-span-2 lg:col-span-1"
  }];

}

export function DashboardOverview() {
  const { data, isPending, isError, error, refetch, isRefetching } = useDashboardSummary();

  if (isPending) {
    return (
      <div className="space-y-6" role="status" aria-live="polite">
        <span className="sr-only">Loading dashboard...</span>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: SKELETON_CARDS }, (_, index) =>
          <Skeleton key={index} className={`h-28 rounded-xl ${index === SKELETON_CARDS - 1 ? "col-span-2 lg:col-span-1" : ""}`} />
          )}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      </div>);

  }

  if (isError) {
    return (
      <ErrorState
        className="rounded-xl border border-slate-200 bg-white"
        title="Unable to load the dashboard."
        message={getErrorMessage(error)}
        onRetry={refetch}
        isRetrying={isRefetching} />);


  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">Overview</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {buildCards(data).map(({ label, ...card }) =>
          <StatCard key={label} label={label} {...card} />
          )}
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentIssues issues={data.recentIssues ?? []} className="lg:col-span-2" />
        <div>
          <StatusBreakdown breakdown={data.statusBreakdown} total={data.totalIssues} />
        </div>
      </div>
    </div>);

}
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../features/auth/hooks";
import { Spinner } from "../components/Spinner";
import { ErrorState } from "../components/ErrorState";
import { getErrorMessage } from "../lib/errors";

export function ProtectedRoute() {
  const location = useLocation();
  const { data: user, isPending, isError, error, refetch, isRefetching } = useCurrentUser();

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Spinner label="Loading your workspace..." />
      </div>);

  }

  if (user) return <Outlet />;

  if (isError) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <ErrorState
          title="Unable to verify your session."
          message={getErrorMessage(error)}
          onRetry={refetch}
          isRetrying={isRefetching} />
        
      </div>);

  }

  return <Navigate to="/login" state={{ from: location }} replace />;
}
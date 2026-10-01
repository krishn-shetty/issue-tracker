import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../features/auth/hooks";
import { Spinner } from "../components/Spinner";

const DEFAULT_REDIRECT = "/dashboard";
const AUTH_PATHS = ["/login", "/register"];

function getRedirectTarget(from) {
  if (!from?.pathname || AUTH_PATHS.includes(from.pathname)) return DEFAULT_REDIRECT;
  return `${from.pathname}${from.search ?? ""}`;
}

export function PublicOnlyRoute() {
  const location = useLocation();
  const { data: user, isPending } = useCurrentUser();

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Spinner label="Loading..." />
      </div>);

  }

  if (user) return <Navigate to={getRedirectTarget(location.state?.from)} replace />;

  return <Outlet />;
}
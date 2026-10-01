import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, LogOut, SquarePen, UserRound } from "lucide-react";
import { Brand } from "../components/Brand";

const NAV_ITEMS = [
{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
// Keep "Issues" highlighted on detail/edit pages, but not on "Create Issue".
{ to: "/issues", label: "Issues", icon: ListTodo, matches: (path) => path.startsWith("/issues/") && path !== "/issues/new" },
{ to: "/issues/new", label: "Create Issue", icon: SquarePen },
{ to: "/profile", label: "Profile", icon: UserRound }];


const ITEM_BASE =
"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";
const ITEM_ACTIVE = "bg-indigo-50 text-indigo-700";
const ITEM_IDLE = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

export function SidebarNav({ onLogout, isLoggingOut, onNavigate }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5">
        <Brand />
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, matches }) =>
          <li key={to}>
              <NavLink
              to={to}
              end
              onClick={onNavigate}
              className={({ isActive }) => `${ITEM_BASE} ${isActive || matches?.(pathname) ? ITEM_ACTIVE : ITEM_IDLE}`}>
              
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="border-t border-slate-200 p-3">
        <button type="button" onClick={onLogout} disabled={isLoggingOut} className={`${ITEM_BASE} ${ITEM_IDLE} cursor-pointer disabled:opacity-60`}>
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>);

}
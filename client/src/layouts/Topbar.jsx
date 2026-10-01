import { useMatches } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Avatar } from "../components/Avatar";
import { RoleBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { useCurrentUser } from "../features/auth/hooks";

const FALLBACK_TITLE = "Issue Tracker";

export function Topbar({ onOpenMenu, isMenuOpen, onLogout, isLoggingOut }) {
  const matches = useMatches();
  const { data: user } = useCurrentUser();
  const title = [...matches].reverse().find((match) => match.handle?.title)?.handle.title ?? FALLBACK_TITLE;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation"
        aria-expanded={isMenuOpen}
        className="-ml-1 grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden">
        
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{title}</p>
      {user &&
      <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={user.name} size="sm" />
          <span className="hidden max-w-48 truncate text-sm font-medium text-slate-800 sm:block" title={user.name}>
            {user.name}
          </span>
          <RoleBadge role={user.role} />
        </div>
      }
      <Button variant="ghost" size="sm" onClick={onLogout} isLoading={isLoggingOut}>
        {!isLoggingOut && <LogOut className="h-4 w-4" aria-hidden="true" />}
        <span className="sr-only sm:not-sr-only">Logout</span>
      </Button>
    </header>);

}
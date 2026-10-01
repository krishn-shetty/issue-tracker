import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLogout } from "../features/auth/hooks";
import { SidebarNav } from "./SidebarNav";
import { MobileDrawer } from "./MobileDrawer";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const logout = useLogout();

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const closeDrawer = () => setIsDrawerOpen(false);
  const handleLogout = () => logout.mutate();

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-lg ring-2 ring-indigo-500 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]">
        
        Skip to content
      </a>

      <aside className="hidden border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 md:flex-col">
        <SidebarNav onLogout={handleLogout} isLoggingOut={logout.isPending} />
      </aside>

      <MobileDrawer open={isDrawerOpen} onClose={closeDrawer}>
        <SidebarNav onLogout={handleLogout} isLoggingOut={logout.isPending} onNavigate={closeDrawer} />
      </MobileDrawer>

      <div className="flex min-h-screen min-w-0 flex-col md:pl-60">
        <Topbar
          onOpenMenu={() => setIsDrawerOpen(true)}
          isMenuOpen={isDrawerOpen}
          onLogout={handleLogout}
          isLoggingOut={logout.isPending} />
        
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}
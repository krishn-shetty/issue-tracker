import { Outlet } from "react-router-dom";
import { Brand } from "../components/Brand";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Brand asLink={false} />
        </div>
        <main className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>);

}
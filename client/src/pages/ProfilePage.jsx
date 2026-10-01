import { LogOut } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Avatar } from "../components/Avatar";
import { RoleBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { useCurrentUser, useLogout } from "../features/auth/hooks";
import { formatDate, formatDateTime } from "../lib/format";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function ProfilePage() {
  useDocumentTitle("Profile");
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  if (!user) return null;

  const rows = [
  { label: "Name", value: user.name },
  { label: "Email", value: user.email },
  { label: "Role", value: <RoleBadge role={user.role} /> },
  {
    label: "Member since",
    value: <time dateTime={user.createdAt} title={formatDateTime(user.createdAt)}>{formatDate(user.createdAt)}</time>
  }];


  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <section aria-labelledby="profile-heading" className="max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4 border-b border-slate-200 p-5 sm:p-6">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0">
            <h2 id="profile-heading" className="break-words text-lg font-semibold text-slate-900">{user.name}</h2>
            <p className="truncate text-sm text-slate-600">{user.email}</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-100 px-5 sm:px-6">
          {rows.map((row) =>
          <div key={row.label} className="grid gap-1 py-3.5 text-sm sm:grid-cols-3 sm:gap-4">
              <dt className="text-slate-600">{row.label}</dt>
              <dd className="min-w-0 break-words font-medium text-slate-900 sm:col-span-2">{row.value}</dd>
            </div>
          )}
        </dl>
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <Button variant="secondary" onClick={() => logout.mutate()} isLoading={logout.isPending} loadingText="Logging out...">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </div>
      </section>
    </>);

}
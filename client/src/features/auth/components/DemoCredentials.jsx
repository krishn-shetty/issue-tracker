const DEMO_ACCOUNTS = [
{ role: "Admin", email: "admin@example.com", password: "Admin@123" },
{ role: "User", email: "rahul@example.com", password: "User@123" }];


// Rendered only in development builds (see LoginPage). Seeded local accounts, not real credentials.
export function DemoCredentials() {
  return (
    <aside aria-label="Demo credentials" className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-600">
      <p className="font-medium text-slate-700">Demo credentials: development only</p>
      <ul className="mt-1.5 space-y-0.5">
        {DEMO_ACCOUNTS.map((account) =>
        <li key={account.email} className="break-all">
            {account.role}: <span className="font-mono">{account.email}</span> / <span className="font-mono">{account.password}</span>
          </li>
        )}
      </ul>
    </aside>);

}
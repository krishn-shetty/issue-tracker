import { Link } from "react-router-dom";

export function StatCard({ label, value, icon: Icon, to, caption, emphasis = false, className = "" }) {
  const surface = emphasis ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white";
  const classes = `block rounded-xl border p-5 ${surface} ${className}`;

  const content =
  <>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-medium ${emphasis ? "text-indigo-800" : "text-slate-600"}`}>{label}</span>
        <Icon className={`h-4 w-4 ${emphasis ? "text-indigo-600" : "text-slate-400"}`} aria-hidden="true" />
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</p>
      {caption && <p className={`mt-1 text-xs ${emphasis ? "text-indigo-700" : "text-slate-500"}`}>{caption}</p>}
    </>;


  if (!to) return <div className={classes}>{content}</div>;

  return (
    <Link
      to={to}
      className={`${classes} transition-colors duration-150 hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}>
      
      {content}
    </Link>);

}
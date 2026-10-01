import { Link } from "react-router-dom";
import { CircleDot } from "lucide-react";

export function Brand({ asLink = true }) {
  const content =
  <>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
        <CircleDot className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold text-slate-900">Issue Tracker</span>
    </>;


  if (!asLink) return <span className="inline-flex items-center gap-2.5">{content}</span>;

  return (
    <Link
      to="/dashboard"
      className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
      
      {content}
    </Link>);

}
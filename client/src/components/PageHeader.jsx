import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function PageHeader({ title, description, actions, meta, backTo, backLabel = "Back" }) {
  return (
    <div className="mb-6">
      {backTo &&
      <Link
        to={backTo}
        className="mb-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>);

}
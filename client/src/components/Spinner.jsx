import { LoaderCircle } from "lucide-react";

export function Spinner({ label = "Loading...", className = "" }) {
  return (
    <div role="status" aria-live="polite" className={`flex items-center justify-center gap-2 text-sm text-slate-600 ${className}`}>
      <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" aria-hidden="true" />
      <span>{label}</span>
    </div>);

}
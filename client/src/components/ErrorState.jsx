import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({ title = "Something went wrong.", message, onRetry, isRetrying = false, className = "" }) {
  return (
    <div role="alert" className={`flex flex-col items-center px-6 py-12 text-center ${className}`}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600">
        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-600">{message}</p>}
      {onRetry &&
      <Button variant="secondary" className="mt-5" onClick={() => onRetry()} isLoading={isRetrying} loadingText="Retrying...">
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      }
    </div>);

}
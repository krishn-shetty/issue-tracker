import { useId } from "react";

// Renders a visible label and wires aria-invalid / aria-describedby into the control via render prop.
export function FormField({ label, error, hint, className = "", children }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {(error || hint) &&
      <div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
          {error ?
        <p id={errorId} className="font-medium text-red-700">
              {error}
            </p> :

        <span />
        }
          {hint &&
        <p id={hintId} className="shrink-0 text-slate-500 tabular-nums">
              {hint}
            </p>
        }
        </div>
      }
    </div>);

}
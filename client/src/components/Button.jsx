import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";

const BASE =
"inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

const VARIANTS = {
  primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
  secondary: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  dangerOutline: "border border-red-200 bg-white text-red-700 shadow-sm hover:bg-red-50 hover:text-red-800",
  dangerGhost: "text-slate-600 hover:bg-red-50 hover:text-red-700"
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  icon: "h-8 w-8"
};

export function buttonClasses({ variant = "primary", size = "md", className = "" } = {}) {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
}

export const Button = forwardRef(function Button(
{ variant, size, className, isLoading = false, loadingText, disabled, type = "button", children, ...props },
ref)
{
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}>
      
      {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {isLoading && loadingText ? loadingText : children}
    </button>);

});
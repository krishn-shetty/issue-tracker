const FIELD_BASE =
"block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
const FIELD_VALID = "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20";
const FIELD_INVALID = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

export function fieldClasses(invalid) {
  return `${FIELD_BASE} ${invalid ? FIELD_INVALID : FIELD_VALID}`;
}
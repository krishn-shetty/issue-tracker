import { getInitials } from "../lib/format";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-lg"
};

export function Avatar({ name, size = "md" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ${SIZES[size]}`}>
      
      {getInitials(name)}
    </span>);

}
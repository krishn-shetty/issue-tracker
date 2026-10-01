import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { fieldClasses } from "./fieldClasses";

export const Select = forwardRef(function Select({ className = "", children, ...props }, ref) {
  return (
    <div className={`relative ${className}`}>
      <select ref={ref} className={`${fieldClasses(props["aria-invalid"])} h-10 cursor-pointer appearance-none pr-9`} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true" />
      
    </div>);

});
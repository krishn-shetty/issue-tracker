import { forwardRef } from "react";
import { fieldClasses } from "./fieldClasses";

export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${fieldClasses(props["aria-invalid"])} h-10 ${className}`} {...props} />;
});
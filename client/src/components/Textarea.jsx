import { forwardRef } from "react";
import { fieldClasses } from "./fieldClasses";

export const Textarea = forwardRef(function Textarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${fieldClasses(props["aria-invalid"])} min-h-24 resize-y py-2 leading-relaxed ${className}`}
      {...props} />);


});
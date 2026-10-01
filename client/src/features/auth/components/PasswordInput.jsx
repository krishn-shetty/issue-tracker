import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../../../components/Input";

export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input ref={ref} {...props} type={isVisible ? "text" : "password"} className="pr-11" />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label="Show password"
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 grid w-10 cursor-pointer place-items-center rounded-r-lg text-slate-500 transition-colors duration-150 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>);

});
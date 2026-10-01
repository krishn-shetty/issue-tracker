import { useRef } from "react";
import { X } from "lucide-react";
import { useModalBehavior } from "../hooks/useModalBehavior";

export function MobileDrawer({ open, onClose, children }) {
  const panelRef = useRef(null);
  useModalBehavior(open, panelRef, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-slate-900/50" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        tabIndex={-1}
        className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl focus:outline-none">
        
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="absolute right-3 top-4 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>);

}
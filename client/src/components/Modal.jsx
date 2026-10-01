import { useRef } from "react";
import { createPortal } from "react-dom";
import { useModalBehavior } from "../hooks/useModalBehavior";

export function Modal({ open, onClose, role = "dialog", labelledBy, describedBy, children }) {
  const panelRef = useRef(null);
  useModalBehavior(open, panelRef, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-slate-900/50" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl focus:outline-none">
        
        {children}
      </div>
    </div>,
    document.body
  );
}
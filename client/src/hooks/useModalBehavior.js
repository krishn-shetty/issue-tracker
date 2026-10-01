import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
"a[href]",
"button:not([disabled])",
"input:not([disabled])",
"select:not([disabled])",
"textarea:not([disabled])",
'[tabindex]:not([tabindex="-1"])'].
join(",");

function getFocusable(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
}

function trapFocus(event, container) {
  const nodes = getFocusable(container);
  if (nodes.length === 0) {
    event.preventDefault();
    return;
  }
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const active = document.activeElement;
  if (!container.contains(active)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

// Shared dialog behaviour: scroll lock, initial focus, Esc to close, focus trap, focus restore.
export function useModalBehavior(open, containerRef, onClose) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;
    if (!open || !container) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (getFocusable(container)[0] ?? container).focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      } else if (event.key === "Tab") {
        trapFocus(event, container);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open, containerRef]);
}
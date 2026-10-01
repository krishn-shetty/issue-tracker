import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

const MAX_FULL_PAGES = 7;

function getPageItems(page, pages) {
  if (pages <= MAX_FULL_PAGES) return Array.from({ length: pages }, (_, index) => index + 1);
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  const items = [1];
  if (start > 2) items.push("start-gap");
  for (let current = start; current <= end; current += 1) items.push(current);
  if (end < pages - 1) items.push("end-gap");
  items.push(pages);
  return items;
}

export function Pagination({ page, pages, total, onPageChange, itemLabel = "item" }) {
  if (!pages) return null;
  const noun = total === 1 ? itemLabel : `${itemLabel}s`;

  return (
    <nav aria-label="Pagination" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600" aria-live="polite">
        Page {page} of {pages} · {total} {noun}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <ul className="hidden items-center gap-1 sm:flex">
          {getPageItems(page, pages).map((item) =>
          typeof item === "number" ?
          <li key={item}>
                <Button
              variant={item === page ? "primary" : "ghost"}
              size="sm"
              className="min-w-8 px-2 tabular-nums"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}>
              
                  {item}
                </Button>
              </li> :

          <li key={item} className="px-1 text-sm text-slate-500" aria-hidden="true">
                …
              </li>

          )}
        </ul>
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= pages} aria-label="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>);

}
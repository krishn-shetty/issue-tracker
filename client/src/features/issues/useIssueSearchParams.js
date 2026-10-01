import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ASSIGNEE_FILTERS, ISSUE_PAGE_SIZE, ISSUE_PRIORITIES, ISSUE_STATUSES, isValidObjectId } from "./constants";
import { cleanParams } from "../../lib/format";

function pickAllowed(value, allowed) {
  return allowed.includes(value) ? value : "";
}

function parseAssignee(value) {
  if (value === ASSIGNEE_FILTERS.ME || value === ASSIGNEE_FILTERS.UNASSIGNED || isValidObjectId(value)) return value;
  return "";
}

function parsePage(value) {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseIssueFilters(searchParams) {
  return {
    search: (searchParams.get("search") ?? "").trim(),
    status: pickAllowed(searchParams.get("status"), ISSUE_STATUSES),
    priority: pickAllowed(searchParams.get("priority"), ISSUE_PRIORITIES),
    assignee: parseAssignee(searchParams.get("assignee")),
    page: parsePage(searchParams.get("page"))
  };
}

export function buildIssueQueryParams(filters) {
  return cleanParams({ ...filters, limit: ISSUE_PAGE_SIZE });
}

// Filters and page live in the URL so refresh, back/forward and shared links restore the view.
export function useIssueSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseIssueFilters(searchParams), [searchParams]);

  const setFilter = useCallback(
    (key, value, { replace = false } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set(key, String(value));else
          next.delete(key);
          if (key !== "page") next.delete("page");
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const setPage = useCallback((page, options) => setFilter("page", page > 1 ? page : "", options), [setFilter]);
  const clearFilters = useCallback(() => setSearchParams({}), [setSearchParams]);
  const hasActiveFilters = Boolean(filters.search || filters.status || filters.priority || filters.assignee);

  return { filters, setFilter, setPage, clearFilters, hasActiveFilters };
}
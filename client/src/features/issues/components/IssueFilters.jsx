import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { FormField } from "../../../components/FormField";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { useDebounce } from "../../../hooks/useDebounce";
import { useAssignableUsers } from "../../users/hooks";
import { ASSIGNEE_FILTERS, PRIORITY_OPTIONS, SEARCH_DEBOUNCE_MS, STATUS_OPTIONS } from "../constants";

export function IssueFilters({ filters, onFilterChange, onClear, hasActiveFilters }) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const lastSyncedSearch = useRef(filters.search);
  const onFilterChangeRef = useRef(onFilterChange);
  const { data: usersData } = useAssignableUsers();
  const users = usersData?.items ?? [];

  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  // Typing -> URL (debounced).
  useEffect(() => {
    const value = debouncedSearch.trim();
    if (value === lastSyncedSearch.current) return;
    lastSyncedSearch.current = value;
    onFilterChangeRef.current("search", value, { replace: true });
  }, [debouncedSearch]);

  // URL -> input, only for external changes (back/forward, Clear filters).
  useEffect(() => {
    if (filters.search === lastSyncedSearch.current) return;
    lastSyncedSearch.current = filters.search;
    setSearchInput(filters.search);
  }, [filters.search]);

  return (
    <div role="search" className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,11rem)_auto] lg:items-end">
      <FormField label="Search" className="sm:col-span-2 lg:col-span-1">
        {(field) =>
        <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <Input {...field} type="search" placeholder="Search issues..." className="pl-9" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          </div>
        }
      </FormField>
      <FormField label="Status">
        {(field) =>
        <Select {...field} value={filters.status} onChange={(event) => onFilterChange("status", event.target.value)}>
            <option value="">All</option>
            {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </Select>
        }
      </FormField>
      <FormField label="Priority">
        {(field) =>
        <Select {...field} value={filters.priority} onChange={(event) => onFilterChange("priority", event.target.value)}>
            <option value="">All</option>
            {PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </Select>
        }
      </FormField>
      <FormField label="Assignee">
        {(field) =>
        <Select {...field} value={filters.assignee} onChange={(event) => onFilterChange("assignee", event.target.value)}>
            <option value="">All</option>
            <option value={ASSIGNEE_FILTERS.ME}>Me</option>
            <option value={ASSIGNEE_FILTERS.UNASSIGNED}>Unassigned</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </Select>
        }
      </FormField>
      {hasActiveFilters &&
      <Button variant="ghost" onClick={onClear} className="sm:justify-self-start">
          Clear filters
        </Button>
      }
    </div>);

}
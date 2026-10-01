export const ISSUE_STATUSES = ["OPEN", "IN_PROGRESS", "CLOSED"];
export const ISSUE_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export const STATUS_LABELS = { OPEN: "Open", IN_PROGRESS: "In Progress", CLOSED: "Closed" };
export const PRIORITY_LABELS = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };

export const STATUS_OPTIONS = ISSUE_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));
export const PRIORITY_OPTIONS = ISSUE_PRIORITIES.map((value) => ({ value, label: PRIORITY_LABELS[value] }));

export const ASSIGNEE_FILTERS = { ME: "me", UNASSIGNED: "unassigned" };

export const ISSUE_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 300;

export const ISSUE_TITLE_MIN = 3;
export const ISSUE_TITLE_MAX = 120;
export const ISSUE_DESCRIPTION_MAX = 5000;

export const DEFAULT_ISSUE_FORM_VALUES = {
  title: "",
  description: "",
  status: "OPEN",
  priority: "MEDIUM",
  assignedTo: ""
};

export const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export function isValidObjectId(value) {
  return typeof value === "string" && OBJECT_ID_PATTERN.test(value);
}
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short" });
const RELATIVE_FORMAT = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const EDITED_THRESHOLD_MS = 1000;
const RELATIVE_UNITS = [
["year", 31_536_000],
["month", 2_592_000],
["week", 604_800],
["day", 86_400],
["hour", 3_600],
["minute", 60]];

const EMPTY_VALUE = "—";

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = toDate(value);
  return date ? DATE_FORMAT.format(date) : EMPTY_VALUE;
}

export function formatDateTime(value) {
  const date = toDate(value);
  return date ? DATE_TIME_FORMAT.format(date) : EMPTY_VALUE;
}

export function formatRelativeTime(value) {
  const date = toDate(value);
  if (!date) return EMPTY_VALUE;
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return RELATIVE_FORMAT.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export function isEdited(createdAt, updatedAt) {
  const created = toDate(createdAt);
  const updated = toDate(updatedAt);
  return Boolean(created && updated && updated.getTime() - created.getTime() > EDITED_THRESHOLD_MS);
}

export function getInitials(name) {
  const initials = (name ?? "").
  trim().
  split(/\s+/).
  slice(0, 2).
  map((part) => part.charAt(0)).
  join("").
  toUpperCase();
  return initials || "?";
}

export function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}
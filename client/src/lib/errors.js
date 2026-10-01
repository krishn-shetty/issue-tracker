const STATUS_MESSAGES = {
  400: "Invalid request.",
  401: "Please log in to continue.",
  403: "You don't have permission to do that.",
  404: "Not found.",
  413: "The request is too large.",
  422: "Please correct the highlighted fields.",
  429: "Too many attempts. Please wait and try again.",
  500: "Something went wrong. Please try again."
};

const CONFLICT_FALLBACK = "This conflicts with existing data.";

export function getErrorMessage(error, overrides = {}) {
  const status = error?.status;
  if (overrides[status]) return overrides[status];
  if (status === 0) return error.message;
  if (status === 409) return error.message || CONFLICT_FALLBACK;
  if (status >= 500) return STATUS_MESSAGES[500];
  return STATUS_MESSAGES[status] ?? STATUS_MESSAGES[500];
}

export function applyServerFieldErrors(error, setError) {
  if (error?.status !== 422) return false;
  const entries = Object.entries(error.fieldErrors ?? {});
  entries.forEach(([field, message]) => setError(field, { type: "server", message }));
  return entries.length > 0;
}
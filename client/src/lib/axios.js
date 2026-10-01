import axios from "axios";
import { API_URL } from "./env";
import { queryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";

const NETWORK_ERROR_MESSAGE = "Cannot reach the server. Check your connection.";
// A 401 from these endpoints is an expected answer, not an expired session.
const SESSION_PROBE_PATHS = ["/auth/me", "/auth/login"];

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000
});

function toFieldErrors(errors) {
  if (!Array.isArray(errors)) return {};
  return errors.reduce((fieldErrors, entry) => {
    if (entry?.field && entry?.message && !fieldErrors[entry.field]) {
      fieldErrors[entry.field] = entry.message;
    }
    return fieldErrors;
  }, {});
}

function normalizeError(error) {
  if (!error.response) {
    return { status: 0, message: NETWORK_ERROR_MESSAGE, fieldErrors: {} };
  }
  const { status, data } = error.response;
  return {
    status,
    message: typeof data?.message === "string" ? data.message : "",
    fieldErrors: toFieldErrors(data?.errors)
  };
}

function isSessionProbe(url = "") {
  return SESSION_PROBE_PATHS.some((path) => url.startsWith(path));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeError(error);
    if (normalized.status === 401 && !isSessionProbe(error.config?.url)) {
      // Session expired: ProtectedRoute reacts to this and redirects to /login.
      queryClient.setQueryData(queryKeys.auth.me, null);
    }
    return Promise.reject(normalized);
  }
);
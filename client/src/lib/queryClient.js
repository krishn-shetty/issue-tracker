import { QueryClient } from "@tanstack/react-query";

const MAX_RETRIES = 1;

// Client errors (4xx) will not succeed on retry; network/5xx get one more attempt.
function shouldRetry(failureCount, error) {
  const status = error?.status;
  if (status >= 400 && status < 500) return false;
  return failureCount < MAX_RETRIES;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
});
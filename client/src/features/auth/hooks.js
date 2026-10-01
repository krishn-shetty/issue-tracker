import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./api";
import { queryKeys } from "../../lib/queryKeys";
import { getErrorMessage } from "../../lib/errors";

export const LOGIN_ERROR_OVERRIDES = { 401: "Invalid email or password." };
const SESSION_STALE_TIME = 5 * 60_000;

// 401 from /auth/me simply means "logged out" — resolve to null instead of erroring.
async function fetchCurrentUserOrNull() {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error?.status === 401) return null;
    throw error;
  }
}

// Drop anything cached for a previous session before storing the new user.
function startSession(queryClient, user) {
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== queryKeys.auth.me[0] });
  queryClient.setQueryData(queryKeys.auth.me, user);
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: fetchCurrentUserOrNull,
    staleTime: SESSION_STALE_TIME
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      startSession(queryClient, user);
      toast.success(`Welcome back, ${user.name}.`);
    },
    onError: (error) => toast.error(getErrorMessage(error, LOGIN_ERROR_OVERRIDES))
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      startSession(queryClient, user);
      toast.success("Account created. Welcome!");
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logoutUser,
    // Clear local state even if the request fails, so no data leaks between accounts.
    onSettled: () => {
      navigate("/login", { replace: true });
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth.me, null);
      toast.success("Logged out.");
    }
  });
}
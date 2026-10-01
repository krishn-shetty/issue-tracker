import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";
import { queryKeys } from "../../lib/queryKeys";

// Server maximum page size for /users — used to populate assignee pickers.
const ASSIGNABLE_USERS_PARAMS = { limit: 100 };
const USERS_STALE_TIME = 5 * 60_000;

export function useUsers(params) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: USERS_STALE_TIME
  });
}

export function useAssignableUsers() {
  return useUsers(ASSIGNABLE_USERS_PARAMS);
}
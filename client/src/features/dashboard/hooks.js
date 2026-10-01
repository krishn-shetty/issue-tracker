import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./api";
import { queryKeys } from "../../lib/queryKeys";

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: getDashboardSummary
  });
}
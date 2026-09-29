import { useQuery } from "@tanstack/react-query";

async function fetchDashboardConfig() {
  const res = await fetch("/api/v1/dashboard-config", {credentials: "include"})
  if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`)
  return res.json()
}

export function useDashboardConfig() {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["dashboard-config"],
        queryFn: fetchDashboardConfig,
        staleTime: 3 * 60 * 1000,
    })

    return {
        flags: data?.data?.flags || {},
        loading: isLoading,
        error: isError ? error.message : null,
        refetch
    }
};
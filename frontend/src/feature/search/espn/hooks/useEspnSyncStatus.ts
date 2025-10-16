// -------------------- Imports -------------------
import { getEspnStatus } from "@services/espn/sync";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom React hook that retrieves ESPN sync status.
 * 
 * @returns An object containing the sync status, loading state, and error state
 */
export default function useEspnSyncStatus() {
    const { data: status, isPending: loading, isError: error } = useQuery({
        queryFn: () => getEspnStatus(),
        queryKey: ['espnSyncStatus']
    });

    return { status, loading, error };
}


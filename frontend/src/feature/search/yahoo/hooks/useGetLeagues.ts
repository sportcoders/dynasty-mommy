import { getLeagues } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";

export function useGetLeagues(enabled: boolean) {
    const { data, isPending, error } = useQuery({
        queryKey: ['yahooLeagues'],
        queryFn: getLeagues,
        enabled: enabled,
    });
    return { data, loading: isPending, error };
}
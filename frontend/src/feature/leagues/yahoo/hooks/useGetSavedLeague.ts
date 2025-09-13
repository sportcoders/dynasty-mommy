import { getSavedYahooLeague } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";

export default function useGetSavedLeague(league_key: string) {
    const { data, isPending: loading, isError: error } = useQuery({
        queryKey: ['savedYahooLeague'],
        queryFn: () => getSavedYahooLeague(league_key)
    });

    return { data, loading, error };
}
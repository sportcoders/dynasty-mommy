import { getAllSavedYahooLeague } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllSavedYahooLeagues() {
    const { data, isPending: loading } = useQuery({
        queryKey: ['allSavedYahooLeagues'],
        queryFn: getAllSavedYahooLeague,
    });
    return { data, loading };
}
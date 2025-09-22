import { getTradeMarket } from "@services/api/sleeper_league";
import { useQuery } from "@tanstack/react-query";

export default function useGetTradeMarket(searchText?: string) {
    const { data, isPending: loading, refetch } = useQuery({
        queryKey: ["trade_market_sleeper"],
        queryFn: () => getTradeMarket({ searchText: searchText })
    });

    return { data, loading, refetch };
}

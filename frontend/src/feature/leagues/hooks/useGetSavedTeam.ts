import { getSavedTeamSleeperLeague } from "@services/api/user";
import { useQuery } from "@tanstack/react-query";

export default function useGetSavedTeam(league_id: string, disabled: boolean) {
    const { data, isFetching, isError } = useQuery({
        queryKey: ['savedTeam', league_id],
        queryFn: () => getSavedTeamSleeperLeague(league_id),
        enabled: !disabled
    });

    return { savedTeam: data, isFetching, isError };
}
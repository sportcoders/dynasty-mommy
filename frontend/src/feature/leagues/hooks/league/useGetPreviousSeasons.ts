import { sleeper_getLeagueInfo } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

const fetchPreviousSeasons = async (league_id: string) => {
    const seasons: { league_id: string, season: string; }[] = [];
    let leagueId = league_id;
    while (leagueId && leagueId != '0') {
        const league = await sleeper_getLeagueInfo(leagueId);
        if (!league) {
            throw new Error("League not found");
        }
        seasons.push({ league_id: leagueId, season: league.season });
        leagueId = league.previous_league_id;
    }
    return seasons;
};
export default function useGetPreviousSeasons(league_id: string) {
    const { data: prevSeasons, isError: error, isPending: loading } = useQuery({
        queryKey: ['prevLeagues', league_id],
        queryFn: () => fetchPreviousSeasons(league_id),
    });
    return { prevSeasons, error, loading };
}
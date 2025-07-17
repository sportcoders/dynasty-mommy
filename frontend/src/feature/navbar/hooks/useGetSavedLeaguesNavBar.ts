import { useGetSavedLeagues } from "@hooks/useGetSavedLeagues";
import { type League } from "@services/api/user";
import { sleeper_getLeagueInfo, type League as SleeperLeague, } from "@services/sleeper";
import { useQueries, } from "@tanstack/react-query";

const leagueInfoForPlatform = async (savedLeague: League): Promise<SleeperLeague> => {
    switch (savedLeague.platform) {
        case "sleeper": {
            const league = await sleeper_getLeagueInfo(savedLeague.league_id)
            return {
                name: league!.name,
                league_id: savedLeague.league_id,
                season: league!.season,
                avatar: league!.avatar

            }
        }
        default:
            throw new Error(`Unsupported platform: ${savedLeague.platform}`)
    }
}
export function useGetSavedLeaguesNavBar() {
    const { isPending: loading, data: savedLeagues, error } = useGetSavedLeagues()
    const queries = useQueries({
        queries: savedLeagues ?
            savedLeagues.map((league) => {
                return {
                    queryKey: ['savedLeague', league.league_id],
                    queryFn: () => leagueInfoForPlatform(league),
                }
            })
            : []
    })
    const leagues = queries.map((league) => league.data).filter((l) => l != undefined)

    return { leagues, loading, error }

}
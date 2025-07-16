import { fetchUserLeagues } from "@services/api/user";
import { sleeper_getLeagueInfo, type League } from "@services/sleeper";
import { useEffect, useState } from "react";

export function useGetSavedLeagues(loggedIn: boolean) {
    const [leagues, setLeagues] = useState<League[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>()
    useEffect(() => {
        const getSavedLeagues = async () => {
            setError("")
            setLoading(true)
            try {

                const res = await fetchUserLeagues()
                if (!res) {
                    throw new Error()
                }
                const sleeper_league_req = []
                for (const league of res.leagues) {
                    sleeper_league_req.push(sleeper_getLeagueInfo(league.league_id))
                }
                const temp_sleeper_leagues = await Promise.all(sleeper_league_req)
                const result: League[] = temp_sleeper_leagues.map((league, index) => (
                    {
                        name: league!.name,
                        league_id: res.leagues[index].league_id,
                        season: league!.season,
                        avatar: league!.avatar
                    }))
                setLeagues(result)
                console.log(result)
            }
            catch (e) {
                console.log(error)
                setError("Error occurred while fetching saved leagues")
            }
            finally {
                setLoading(false)
            }

        }
        if (loggedIn) getSavedLeagues()
        console.log(loggedIn)
    }, [loggedIn])

    return { leagues, loading, error }
}
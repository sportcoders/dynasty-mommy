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
                const league_promises = []
                for (const league of res.leagues) {
                    switch (league.platform) {
                        case "sleeper":
                            league_promises.push(sleeper_getLeagueInfo(league.league_id))
                    }
                }
                const league_res = await Promise.all(league_promises)
                const result: League[] = league_res.map((league, index) => (
                    {
                        name: league!.name,
                        league_id: res.leagues[index].league_id,
                        season: league!.season,
                        avatar: league!.avatar
                    }))
                setLeagues(result)
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
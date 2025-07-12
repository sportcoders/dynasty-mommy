import { sleeper_getLeagueInfo } from "@services/sleeper";
import { useEffect, useState } from "react";

export default function useGetPreviousSeasons({ league_id }: { league_id: string }) {
    const [prevSeasons, setPrevSeasons] = useState<{ league_id: string, season: string }[]>([])
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchPreviousSeasons = async () => {
            setLoading(true)
            setError("")
            let leagueId = league_id
            while (leagueId) {
                const league = await sleeper_getLeagueInfo(leagueId)
                if (!league) {
                    setError("error fetching league")
                    break
                }
                setPrevSeasons([...prevSeasons, { league_id: leagueId, season: league.season }])
                leagueId = league.previous_league_id
            }
            setLoading(false)
        }
        fetchPreviousSeasons()
    }, [league_id])
    return { prevSeasons, error, loading }
}
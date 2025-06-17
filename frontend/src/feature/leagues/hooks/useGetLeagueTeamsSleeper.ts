import { getTeamInfo, type TeamInfo } from "@services/sleeper";
import { useEffect, useState } from "react";

export default function useGetLeagueTeamsSleeper(league_id: string) {
    const [teams, setTeams] = useState<TeamInfo[] | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setError("")
                setLoading(true)
                const res = await getTeamInfo(league_id)
                if (res)
                    setTeams(res)
            }
            catch (e: any) {
                setError("An error occured")
                // setError(e.message)
            }
            finally {
                setLoading(false)
            }
        }
        fetchTeams()
    }, [league_id])

    return { loading, error, teams }
}
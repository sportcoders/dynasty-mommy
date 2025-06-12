import { type LeagueInfo, getLeagueInfo } from "@services/sleeper"
import { useState, useEffect } from "react"

export default function useGetLeagueInfo(league_id: string) {
    const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null)

    useEffect(() => {
        const loadLeagueInfo = async () => {
            try {
                const response = await getLeagueInfo(league_id)

                setLeagueInfo(response)
            }
            catch (error) {
                console.log(error)
            }
        }
        loadLeagueInfo()
    }, [league_id])
    return leagueInfo
}
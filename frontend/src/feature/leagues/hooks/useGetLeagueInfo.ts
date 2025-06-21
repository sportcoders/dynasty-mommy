import { type LeagueInfo, getLeagueInfo, sleeper_getAvatarThumbnail } from "@services/sleeper"
import { useState, useEffect } from "react"
const getAvatar = async (avatar_id: string) => {
    const blob = await sleeper_getAvatarThumbnail(avatar_id)
    const url = URL.createObjectURL(blob)
    return url
}
export default function useGetLeagueInfo(league_id: string) {
    /**
     * Custom React hook that retrieves a sleeper league scoring information
     * ex. points per shot, steal, etc..
     * 
     * @param {string} leauge_id - the id of the league the user wants to view
     * 
     * @returns {object} - An object contain the league info, error and loading status
     */
    const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState("")
    useEffect(() => {
        const loadLeagueInfo = async () => {
            setLoading(true)
            try {
                const response = await getLeagueInfo(league_id)
                if (response.avatar) {
                    response.avatar = await getAvatar(response.avatar)
                }
                setLeagueInfo(response)
            }
            catch (error: any) {
                setError(error.message)
            }
            finally {
                setLoading(false)
            }
        }
        loadLeagueInfo()
        return () => {
            if (leagueInfo && leagueInfo.avatar) {
                URL.revokeObjectURL(leagueInfo.avatar)
            }
        }
    }, [league_id])
    return { leagueInfo, loading, error }
}
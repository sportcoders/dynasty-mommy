import { type Player, sleeper_getPlayers } from "@services/sleeper"
import { useEffect, useState } from "react"

export default function useGetPlayersSleeper(league_id: string) {
    /**
     * Custom React hook to retrieve all the players on teams in a sleeper league
     * 
     * @param {string} league_id - the id of the league
     * 
     * @returns {object} - An object containing the players, error and loading state
     */
    const [players, setPlayers] = useState<Record<string, Player[]> | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true)
                setError("")
                const res = await sleeper_getPlayers(league_id)
                if (res)
                    setPlayers(res)
            }
            catch (e: any) {
                setError(e.message)
            }
            finally {
                setLoading(false)
            }
        }
        fetchPlayers()
    }, [league_id])
    return { players, error, loading }
}
import { type Player, sleeper_getPlayers } from "@services/sleeper"
import { useEffect, useState } from "react"

/**
 * Custom React hook to retrieve all the players on teams in a Sleeper league.
 *
 * Fetches player information for all teams in the specified league and manages loading and error states.
 *
 * @param {string} league_id - The id of the league.
 * @returns An object containing the players (grouped by team), error message, and loading state.
 */
export default function useGetPlayersSleeper(league_id: string) {
    const [players, setPlayers] = useState<Record<string, Player[]> | null>(null)
    const [error, setError] = useState<string | null>()
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
            catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message)
                } else {
                    setError(String(e))
                }
            }
            finally {
                setLoading(false)
            }
        }
        
        fetchPlayers()
    }, [league_id])

    return { players, error, loading }
}
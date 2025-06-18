import { type Player, sleeper_getPlayersForRoster } from "@services/sleeper"
import { useEffect, useState } from "react"

export default function useGetPlayersOnRosterSleeper(league_id: string) {
    /**
     * Custom React hook to retrieve all the players on a team in a sleeper league
     * 
     * @param {string} league_id - the id of the league
     * 
     * @returns {object} - An object containing the players, error and loading state
     * @returns {object} players - the players for given roster
     * @returns {function} setOwnerId - setter for ownerId
     * @returns {boolean} loading - boolean for if data is currently being fetched
     * @returns {string} error - error message, empty string if no error
     */
    const [players, setPlayers] = useState<Player[] | null>(null)
    const [owner_id, setOwnerId] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true)
                setError("")
                const res = await sleeper_getPlayersForRoster(league_id, owner_id)
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
        if (owner_id)
            fetchPlayers()
    }, [league_id, owner_id])
    return { players, error, loading, setOwnerId }
}
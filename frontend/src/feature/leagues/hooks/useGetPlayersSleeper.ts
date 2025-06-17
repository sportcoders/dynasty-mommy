import { type Player, sleeper_getPlayers } from "@services/sleeper"
import { useEffect, useState } from "react"

export default function useGetPlayersSleeper(league_id: string) {
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
import { sleeper_getAllLeagueTransactions, type sleeper_transactions } from "@services/sleeper"
import { useEffect, useState } from "react"

interface useGetAllTransactionsTypeProps {
    league_id: string,
    filter_by: 'commissioner' | 'none' | 'free_agent' | 'trade'
}
export default function useGetAllTransactionsType({ league_id, filter_by }: useGetAllTransactionsTypeProps) {
    const [transactions, setTransactions] = useState<sleeper_transactions[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true)
            setError("")
            try {
                const data = await sleeper_getAllLeagueTransactions(league_id)
                switch (filter_by) {
                    case "commissioner":
                        const commissioner_moves = data.filter((transaction) => transaction.type == 'commisioner' || transaction.type == "error")
                        setTransactions(commissioner_moves)
                        break
                    case "free_agent":
                        const free_agent = data.filter((transaction) => transaction.type == 'free_agent' || transaction.type == "error")
                        setTransactions(free_agent)
                        break
                    case "trade":
                        const trades = data.filter((transaction) => transaction.type == "trade" || transaction.type == "error")
                        setTransactions(trades)
                        break
                    case "none":
                        setTransactions(data)
                        break
                    default:
                        throw new Error("Invalid filter by selection")
                }
            }
            catch (e: any) {
                if (e instanceof Error)
                    setError(e.message)
            }
            finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [league_id, filter_by])

    return { transactions, loading, error }
}
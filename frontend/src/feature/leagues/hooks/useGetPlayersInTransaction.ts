import { sleeper_getPlayersInTransaction, type Transaction } from "@services/sleeper";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * Custom React hook to retrieve all the players on teams in a Sleeper league.
 *
 * Fetches player information for all teams in the specified league and manages loading and error states.
 *
 * @param {string} league_id - The id of the league.
 * @returns An object containing the players (grouped by team), error message, and loading state.
 */
export default function useGetPlayersInTransaction(transaction: Transaction) {
    const { data: players, isError: error, isLoading: loading } = useSuspenseQuery({
        queryKey: ['nba_players_sleeper_league', transaction.transaction_id],
        queryFn: () => sleeper_getPlayersInTransaction(transaction)
    });

    return { players, error, loading };
}
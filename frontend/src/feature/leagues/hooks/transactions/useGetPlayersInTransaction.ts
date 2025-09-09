import { sleeper_getPlayersInTransaction, type Transaction } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom React hook to retrieve all the players involved in a sleeper transaction.
 *
 * Used as not all players involved in a sleeper transaction are on a team
 *
 * @param {Transaction} transaction - Sleeper Transaction object
 * @returns An dict containing the player_ids(as keys) and corresponding player objects as values
 */
export default function useGetPlayersInTransaction(transaction: Transaction) {
    const { data: players, isError: error, isPending: loading, isEnabled } = useQuery({
        queryKey: ['transaction_players', transaction.transaction_id],
        queryFn: () => sleeper_getPlayersInTransaction(transaction),
        enabled: !!transaction.drops || !!transaction.adds,
    });

    return { players, error, loading, isEnabled };
}
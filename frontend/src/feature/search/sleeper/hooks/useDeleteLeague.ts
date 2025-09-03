// -------------------- Imports --------------------
import { useNotification } from "@hooks/useNotification";

import { removeLeagueFromUser, type League } from "@services/api/user";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to handle deleting a league from a user's saved list.
 *
 * Wraps a React Query mutation around the `removeLeagueFromUser` API call.
 * - On success, invalidates cached queries for saved leagues and the specific league.
 * - Provides feedback to the user through notifications.
 *
 * @returns An object containing:
 * - `mutate` - Function to trigger the delete mutation.
 * - `isPending` - Whether the mutation is currently running.
 * - `isError` - Whether the mutation failed.
 * - `isSuccess` - Whether the mutation succeeded.
 */
export default function useDeleteLeague() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (league: League) => removeLeagueFromUser(league),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] });

            // useIsUserLeague.ts
            queryClient.invalidateQueries({ queryKey: ['league', variables] });

            showSuccess("League removed successfully");
        },
        onError: () => {
            showError("Failed to remove league");
        }
    });

    return { mutate, isPending, isError, isSuccess };
}
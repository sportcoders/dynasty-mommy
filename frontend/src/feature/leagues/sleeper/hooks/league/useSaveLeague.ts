// -------------------- Imports -------------------
import { useNotification } from "@hooks/useNotification";

import { saveSleeperLeague, type League } from "@services/api/user";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * A custom React hook that uses `@tanstack/react-query` for saving a Sleeper league.
 *
 * This hook provides a mutation function to persist a `League` object to the user's saved leagues.
 * Upon successful completion, it automatically invalidates related queries (`'userSavedLeagues'` and the specific league query)
 * to ensure the UI is automatically updated. It also provides notifications for success and failure.
 * 
 * @returns An object containing the mutation function and its state.
 * - `mutate`: The function to call to save a league. It takes a `League` object as an argument.
 * - `isPending`: A boolean that is `true` while the save operation is in progress.
 * - `isError`: A boolean that is `true` if the save operation failed.
 * - `isSuccess`: A boolean that is `true` if the save operation was successful.
 */
export default function useSaveLeague() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (league: League) => saveSleeperLeague(league),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] });

            // useIsUserLeague.ts
            queryClient.invalidateQueries({ queryKey: ['league', variables] });

            showSuccess("League saved successfully");
        },
        onError: () => {
            showError("Failed to save league");
        }

    });

    return { mutate, isPending, isError, isSuccess };
}
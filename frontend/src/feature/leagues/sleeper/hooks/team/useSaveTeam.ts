// -------------------- Imports -------------------
import { useNotification } from "@hooks/useNotification";

import { saveSleeperLeague } from "@services/api/sleeper_league";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * A custom React hook that uses `@tanstack/react-query` to save a Sleeper league team.
 *
 * This hook provides a mutation function to save a team associated with a specific league and user.
 * Upon successful saving, it automatically invalidates two key queries:
 * 1. `'userSavedLeagues'`: To refresh the list of all saved leagues.
 * 2. `['savedTeam', league_id]`: To update the state of the specific saved team, which is used by `useGetSavedTeam`.
 *
 * It also displays a success notification. If the saving process fails, it shows an error notification.
 *
 * @returns An object containing the mutation function and its state.
 * - `mutate`: The function to call to save the team, requiring `league_id` and `user_id`.
 * - `isPending`: A boolean that is `true` while the save operation is in progress.
 * - `isError`: A boolean that is `true` if the save operation failed.
 * - `isSuccess`: A boolean that is `true` if the save operation was successful.
 */
export default function useSaveSleeperLeague() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: ({ user_id, league_id }: { league_id: string, user_id: string; }) => saveSleeperLeague({ league_id, user_id }),
        onSuccess: (_, { league_id }) => {
            queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] });
            queryClient.invalidateQueries({ queryKey: ['savedTeam', league_id] });
            showSuccess("Team saved successfully");
        },
        onError: () => {
            showError("Failed to save team");
        }

    });

    return { mutate, isPending, isError, isSuccess };
}
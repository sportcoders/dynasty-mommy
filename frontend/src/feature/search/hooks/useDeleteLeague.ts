import { removeLeagueFromUser, type League } from "@services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";

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
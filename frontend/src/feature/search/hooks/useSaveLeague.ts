import { addLeagueToUser, type League } from "@services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";

export default function useSaveLeague() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (league: League) => addLeagueToUser(league),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] });
            showSuccess("League saved successfully");
        },
        onError: () => {
            showError("Failed to save league");
        }

    });

    return { mutate, isPending, isError, isSuccess };
}
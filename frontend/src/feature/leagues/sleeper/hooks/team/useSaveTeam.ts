import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { saveSleeperLeague } from "@services/api/user";

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
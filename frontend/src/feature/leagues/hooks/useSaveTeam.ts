import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { saveSleeperLeague } from "@services/api/user";

export default function useSaveSleeperLeague(league_id: string) {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: ({ roster_id, user_id }: { roster_id: number, user_id: string; }) => saveSleeperLeague({ league_id, roster_id, user_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedTeam', league_id] });
            showSuccess("Team saved successfully");
        },
        onError: () => {
            showError("Failed to save team");
        }

    });

    return { mutate, isPending, isError, isSuccess };
}
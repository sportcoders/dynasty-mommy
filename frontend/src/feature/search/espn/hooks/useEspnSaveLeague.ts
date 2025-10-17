import { useNotification } from "@hooks/useNotification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveLeague } from "@services/espn/league";
import type { SaveLeaguePayload } from "@services/espn/types";


export default function useEspnSaveLeague() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (payload: SaveLeaguePayload) => saveLeague(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] });

            showSuccess("Saved league successfully");
        },
        onError: () => {
            showError("Failed to save league");
        }
    });

    return { mutate, isPending, isError, isSuccess };
}
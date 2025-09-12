// -------------------- Imports -------------------
import { useNotification } from "@hooks/useNotification";
import { removeYahooLeague, type LeagueYahooParams } from "@services/api/yahoo";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteLeague() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (league: LeagueYahooParams) => removeYahooLeague(league.league_key),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] });
            queryClient.invalidateQueries({ queryKey: ['allSavedYahooLeagues'] });

            queryClient.invalidateQueries({ queryKey: ['savedYahooLeague'] });

            showSuccess("League removed successfully");
        },
        onError: (e) => {
            showError("Failed to remove league");
        }

    });

    return { mutate, isPending, isError, isSuccess };
}
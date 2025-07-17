import { addLeagueToUser, type League } from "@services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useSaveLeague() {
    const queryClient = useQueryClient()

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (league: League) => addLeagueToUser(league),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] }) }

    })

    return { mutate, isPending, isError, isSuccess }
}
import { removeLeagueFromUser, type League } from "@services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteLeague() {
    const queryClient = useQueryClient()
    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (league: League) => removeLeagueFromUser(league),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['userSavedLeagues'] }) }
    })

    return { mutate, isPending, isError, isSuccess }
}
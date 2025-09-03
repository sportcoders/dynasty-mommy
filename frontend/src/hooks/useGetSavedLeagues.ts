import { useAppSelector } from '@app/hooks';
import { fetchUserLeagues } from '@services/api/user';
import { useQuery } from '@tanstack/react-query';


export function useGetSavedLeagues() {
    const username = useAppSelector(state => state.auth.username);
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['userSavedLeagues'],
        queryFn: fetchUserLeagues,
        enabled: !!username,
        select: (leagues) => leagues?.leagues
    });

    return { isPending, isError, data, error };
}
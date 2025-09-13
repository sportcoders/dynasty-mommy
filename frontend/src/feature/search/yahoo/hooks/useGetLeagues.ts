import { ServerError } from "@app/utils/errors";
import { getLeagues } from "@services/api/yahoo";
import { useQuery } from "@tanstack/react-query";

export function useGetLeagues(enabled: boolean) {
    const { data, isPending, error } = useQuery({
        queryKey: ['yahooLeagues'],
        queryFn: getLeagues,
        enabled: enabled,
        retry(failureCount, error) {

            if (error instanceof ServerError) {
                if (error.statusCode != 403 && error.statusCode != 401) {
                    return true;
                }
            }
            return true && (failureCount < 3);
        },
    });
    return { data, loading: isPending, error };
}
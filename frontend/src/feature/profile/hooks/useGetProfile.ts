import { getProfileInfo } from "@services/api/user";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetProfile() {
    const { data, isPending: loading, isError: error } = useSuspenseQuery({
        queryFn: getProfileInfo,
        queryKey: ["DM_USER_PROFILE"]
    });

    return { data };
}
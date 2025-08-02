import { sleeper_get_state } from "@services/sleeper";
import { useSuspenseQuery } from "@tanstack/react-query";
export default function useGetSleeperState() {
    const { data, isError, isPending: loading } = useSuspenseQuery({
        queryKey: ['sleeper_state'],
        queryFn: () => sleeper_get_state(),
    });

    return { data, isError, loading };
}

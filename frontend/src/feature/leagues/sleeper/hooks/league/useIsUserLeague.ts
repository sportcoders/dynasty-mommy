// -------------------- Imports -------------------
import { isUserLeague } from "@services/api/sleeper_league";
import type { UserLeague } from "@services/api/user";

import { useQuery } from "@tanstack/react-query";

/**
 * A React hook that uses `@tanstack/react-query` to check if a given league belongs to the current user.
 *
 * The query is enabled only when `league.league_id`, `league.platform`, and the `disabled` flag are all truthy,
 * preventing unnecessary API calls.
 *
 * @param props - The hook's parameters.
 * @param props.league - The league object to check.
 * @param props.disabled - A flag to disable the query from running.
 * @returns An object containing the query data (true if it's a user league, false otherwise), error state, and loading state.
 */
export default function useIsUserLeague(league: UserLeague, disabled: boolean) {
    const { data, isError, isPending: loading } = useQuery({
        queryKey: ['league', league],
        queryFn: () => isUserLeague(league),
        enabled: !!league.league_id && !!league.platform && !disabled,
    });

    return { data, isError, loading };
}

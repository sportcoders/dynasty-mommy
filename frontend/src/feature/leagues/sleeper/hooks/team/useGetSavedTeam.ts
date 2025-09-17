// -------------------- Imports -------------------
import { getSavedTeamSleeperLeague, type savedSleeperTeamResponse } from "@services/api/sleeper_league";

import { useQuery } from "@tanstack/react-query";

/**
 * A custom React hook that uses `@tanstack/react-query` to fetch a saved team for a specific league.
 *
 * This hook is conditionally enabled based on the `disabled` flag, preventing the query from running
 * if it's not needed. It returns the fetched team data along with the fetching and error states.
 *
 * @param league_id The ID of the league to get the saved team for.
 * @param disabled A flag to disable the query from running.
 * @returns An object containing the query data and its state.
 * - `savedTeam`: The fetched saved team data, which can be `null` if no team is saved, or `undefined` while loading or on error.
 * - `isFetching`: A boolean that is `true` while the query is in progress.
 * - `isError`: A boolean that is `true` if the query failed.
 */
export default function useGetSavedTeam(league_id: string, disabled: boolean) {
    const { data, isFetching, isError } = useQuery<savedSleeperTeamResponse | null>({
        queryKey: ['savedTeam', league_id],
        queryFn: async () => getSavedTeamSleeperLeague(league_id),
        enabled: !disabled,
    });

    return { savedTeam: data, isFetching, isError };
};
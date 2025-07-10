import {
    type Player,
    sleeper_getPlayersForRoster,
    sleeper_getPlayersForRoster_rosterid,
} from "@services/sleeper";
import { useEffect, useState } from "react";

/**
 * Custom React hook that fetches all players on a specific roster in a Sleeper league.
 *
 * Fetches player information for a given league and owner (team), and manages loading and error states.
 * Provides a function to refresh the roster or switch to a different owner's roster.
 *
 * @param league_id - The unique identifier for the league.
 * @returns An object containing the players, error message, loading state, and a function to refresh or change the roster.
 */
export default function useGetPlayersOnRosterSleeper(league_id: string) {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setForceRefresh] = useState<number>(0);
    const [roster_id, setRosterId] = useState<number>(1);

    const refreshRoster = (owner_id: number) => {
        console.log(owner_id);
        setRosterId((prev) => {
            if (prev == owner_id) {
                setForceRefresh((prev) => prev + 1);
                return prev;
            }
            return owner_id;
        });
    };

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await sleeper_getPlayersForRoster_rosterid(
                    league_id,
                    roster_id
                );
                if (res) setPlayers(res);
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError(String(e));
                }
            } finally {
                setLoading(false);
            }
        };

        if (roster_id) fetchPlayers();
    }, [league_id, roster_id, refresh]);

    return { players, error, loading, refreshRoster };
}

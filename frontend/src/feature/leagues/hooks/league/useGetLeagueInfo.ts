import { SleeperError } from "@utils/errors";
import { type LeagueInfo, sleeper_getLeagueInfo, sleeper_getAvatarThumbnail } from "@services/sleeper";
import { useState, useEffect } from "react";

/**
 * Fetches and returns a URL for a league avatar image given its avatar ID.
 *
 * @param avatar_id - The unique identifier for the avatar image.
 * @returns A promise that resolves to the object URL for the avatar image,
 * or null if the avatar could not be fetched.
 */
const getAvatar = async (avatar_id: string) => {
    const blob = await sleeper_getAvatarThumbnail(avatar_id);
    if (!blob) {
        return null;
    }

    const url = URL.createObjectURL(blob);
    return url;
};

/**
 * Custom React hook that retrieves Sleeper league scoring information and avatar.
 * 
 * Fetches league details such as points per shot, steal, etc., and resolves the league's avatar image URL.
 * Handles loading and error states, and revokes the avatar object URL on cleanup.
 *
 * @param league_id - The id of the league to fetch information for.
 * @returns An object containing the league info, loading status, and error message.
 */
export default function useGetLeagueInfo(league_id: string) {
    /**
     * Custom React hook that retrieves a sleeper league scoring information
     * ex. points per shot, steal, etc..
     * 
     * @param {string} leauge_id - the id of the league the user wants to view
     * 
     * @returns {object} - An object contain the league info, error and loading status
     */
    const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLeagueInfo = async () => {
            setLoading(true);
            try {
                let response;

                try {
                    response = await sleeper_getLeagueInfo(league_id);
                } catch (error) {
                    setError("Failed to fetch league information.");

                    if (error instanceof SleeperError) {
                        return { success: false, statusCode: error.statusCode };

                    }

                    return { success: false };
                }

                if (!response) {
                    setError('League not found.');
                    return { success: false };
                }

                if (response.avatar) {
                    try {
                        response.avatar = await getAvatar(response.avatar) || "";
                    } catch (error) {
                        setError("Failed to load league avatar.");

                        if (error instanceof SleeperError) {
                            return { success: false, statusCode: error.statusCode };

                        }

                        return { success: false };

                    }
                }

                setLeagueInfo(response);
            }
            catch (error: unknown) {
                // Not sure if we want console error, maybe it'll help with error stack tracing
                // console.error('League info fetch failed:', error);
                setError('An unexpected error occurred while loading league data.');
            }
            finally {
                setLoading(false);
            }
        };

        loadLeagueInfo();

        return () => {
            if (leagueInfo && leagueInfo.avatar) {
                URL.revokeObjectURL(leagueInfo.avatar);
            }
        };
    }, [league_id]);

    return { leagueInfo, loading, error };
}
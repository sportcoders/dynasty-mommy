import { useAppSelector } from "@app/hooks";
import { fetchUserLeagues } from "@services/api/user";
import {
    sleeper_getAvatarThumbnail,
    sleeper_getLeagues,
} from "@services/sleeper";
import type { League } from "@services/sleeper/types";
import { useEffect, useRef, useState } from "react";

export default function useGetUserLeaguesSleeper(
    searchType: string,
    value: string,
    season: string
) {
    /**
     * Custom React hook that retrieves user league data from the Sleeper API based on the specified search type.
     *
     * @param {string} searchType - The type of search to perform, username or league id
     * CURRENTLY ONLY LEAGUE ID IS SUPPORTED
     * @param {string} value - The value to search based on the given search type, for searchType username, the value is the username
     * @param {string} season - The fantasy season which the user would like to view their teams for
     *
     * @returns {object} - object containg list of leagues, error and loading state
     */
    const [leagues, setLeagues] = useState<League[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>("");
    const [userLeagues, setUserLeagues] = useState<string[]>([]);
    const blobUrls = useRef<string[]>([]);
    const username = useAppSelector((state) => state.authReducer.username);
    useEffect(() => {
        const fetchLeagues = async () => {
            setLoading(true);
            setError(null);
            setLeagues([]);

            try {
                let leagues: League[] = [];
                if (searchType === "Username") {
                    leagues = await sleeper_getLeagues(value, season);
                } else if (searchType === "League ID") {
                    setError("Search by League ID not implemented yet");
                    setLoading(false);
                    return;
                }
                for (const league of leagues) {
                    if (league.avatar) {
                        const blob = await sleeper_getAvatarThumbnail(
                            league.avatar
                        );

                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            league.avatar = url;
                            blobUrls.current.push(url);
                        }
                    }
                }

                /**TODO: STORE IN LOCAL STORAGE SO USER DOESN'T HAVE TO CALL API EVERY TIME */
                setLeagues(leagues);
            } catch (err) {
                setError("Error fetching leagues");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchUserSavedLeagues = async () => {
            if (username) {
                const leagues = await fetchUserLeagues();
                if (leagues) {
                    /**
                     * For each league it checks if the platform is sleeper, if it is it
                     * adds to the current array(called result) and continues
                     * reduce will then return the result array
                     */
                    const sleeper_leagues = leagues.leagues.reduce<string[]>(
                        (result, league) => {
                            if (league.platform == "sleeper") {
                                result.push(league.league_id);
                            }
                            return result;
                        },
                        []
                    );
                    setUserLeagues(sleeper_leagues);
                }
            }
        };

        fetchLeagues();
        fetchUserSavedLeagues();

        return () => {
            // leagues.forEach((league) => URL.revokeObjectURL(league.avatar))

            blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
            blobUrls.current = [];
        };
    }, [searchType, value, season]);

    return { leagues, loading, error, userLeagues };
}

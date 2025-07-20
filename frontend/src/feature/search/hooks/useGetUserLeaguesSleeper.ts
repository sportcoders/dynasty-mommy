import {
    sleeper_getAvatarThumbnail,
    sleeper_getLeagues,
    type League,
} from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function useGetUserLeaguesSleeper(
    username: string,
    season: string
) {
    /**
     * Custom React hook that retrieves user league data from the Sleeper API by username
     *
     * @param {string} username - The users sleeper username
     * @param {string} season - The fantasy season which the user would like to view their teams for
     *
     * @returns {object} - object containg list of leagues, error and loading state
     */

    const blobUrls = useRef<string[]>([]);
    const [leaguesWithAvatars, setLeaguesWithAvatars] = useState<League[]>([]);

    const { isPending: loading, isError: error, data } = useQuery({
        queryKey: ['getLeaguesSleeperUsername', username, season],
        queryFn: () => sleeper_getLeagues(username, season),
    })

    useEffect(() => {
        if (!data) {
            setLeaguesWithAvatars([]);
            return;
        }

        const getAvatars = async () => {
            const leaguesWithUrls = await Promise.all(
                data.map(async (league) => {
                    if (league.avatar) {
                        try {
                            const blob = await sleeper_getAvatarThumbnail(league.avatar);
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                blobUrls.current.push(url);
                                return { ...league, avatar: url };
                            }
                        } catch (err) {
                            console.error('Failed to load avatar for league:', league.name, err);
                        }
                    }
                    return league;
                })
            );
            setLeaguesWithAvatars(leaguesWithUrls);
        };

        getAvatars();

        return () => {
            // leagues.forEach((league) => URL.revokeObjectURL(league.avatar))
            blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
            blobUrls.current = [];
        };
    }, [data]);

    return { leagues: leaguesWithAvatars, loading, error };
}
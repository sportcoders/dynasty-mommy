import { sleeper_getAvatarThumbnail, sleeper_getLeagues } from "@services/sleeper";
import type { League } from "@services/sleeper/types";
import { useEffect, useRef, useState } from "react";

export default function useGetUserLeaguesSleeper(searchType: string, value: string, season: string) {
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
    const [leagues, setLeagues] = useState<League[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>("")
    const blobUrls = useRef<string[]>([])

    useEffect(() => {
        const fetchLeagues = async () => {
            setLoading(true)
            setError(null)
            setLeagues([])

            try {
                let leagues: League[] = []
                if (searchType === 'Username') {
                    leagues = await sleeper_getLeagues(value, season)
                } else if (searchType === 'League ID') {
                    setError('Search by League ID not implemented yet')
                    setLoading(false)
                    return
                }
                for (const league of leagues) {
                    if (league.avatar) {
                        const blob = await sleeper_getAvatarThumbnail(league.avatar)
                        const url = URL.createObjectURL(blob)
                        league.avatar = url
                        blobUrls.current.push(url)
                    }
                }

                /**TODO: STORE IN LOCAL STORAGE SO USER DOESN'T HAVE TO CALL API EVERY TIME */
                setLeagues(leagues)

            } catch (err) {
                setError('Error fetching leagues')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchLeagues()

        return () => {
            // leagues.forEach((league) => URL.revokeObjectURL(league.avatar))

            blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
            blobUrls.current = [];
        }
    }, [searchType, value, season])

    return { leagues, loading, error }
}
import { sleeper_getTeamInfo, sleeper_getAvatarThumbnail } from "@services/sleeper";
import { type TeamInfo } from "@services/sleeper";
import { useEffect, useState } from "react";
import { set } from "zod/v4";

/**
 * Fetches and returns a URL for a league avatar image given its avatar ID.
 *
 * @param avatar_id - The unique identifier for the avatar image.
 * @returns A promise that resolves to the object URL for the avatar image,
 * or null if the avatar could not be fetched.
 */
const getAvatar = async (avatar_id: string) => {
    const blob = await sleeper_getAvatarThumbnail(avatar_id)
    if (!blob) {
        return null
    } 

    const url = URL.createObjectURL(blob)
    return url
}

/**
 * Custom React hook that fetches all teams in a Sleeper league, including their avatars.
 *
 * Fetches team information and resolves each team's avatar image URL.
 * Handles loading and error states, and revokes avatar object URLs on cleanup.
 *
 * @param league_id - The unique identifier for the league.
 * @returns An object containing the loading state, error message, and array of teams (with avatars).
 */
export default function useGetLeagueTeamsSleeper(league_id: string) {
    const [teams, setTeams] = useState<TeamInfo[] | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setError("")
                setLoading(true)
                const res = await sleeper_getTeamInfo(league_id)
                if (res) {
                    const reqAvatars = await Promise.allSettled(res.map((team) => (team && team.avatar) && getAvatar(team.avatar)))
                    const resAvatars = reqAvatars.map((result) => result.status == 'fulfilled' ? result.value : "")
                    const teams_with_avatar = res.map((team, index) => ({ ...team, avatar: resAvatars[index] }))
                    setTeams(teams_with_avatar)
                }
            }
            catch (e: unknown) {
                if (e instanceof Error) {
                    setError(e.message)
                } else {
                    setError(String(e))
                }
            }
            finally {
                setLoading(false)
            }
        }
        
        fetchTeams()

        return () => {
            if (teams)
                teams.forEach((team) => team.avatar && URL.revokeObjectURL(team.avatar));
        }
    }, [league_id, teams])

    return { loading, error, teams }
}
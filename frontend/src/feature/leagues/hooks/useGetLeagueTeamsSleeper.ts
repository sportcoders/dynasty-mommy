import { getTeamInfo, sleeper_getAvatarThumbnail } from "@services/sleeper";
import { type TeamInfo } from "@services/sleeper";
import { useEffect, useState } from "react";
const getAvatar = async (avatar_id: string) => {
    const blob = await sleeper_getAvatarThumbnail(avatar_id)
    const url = URL.createObjectURL(blob)
    return url
}
export default function useGetLeagueTeamsSleeper(league_id: string) {
    /**
     * Custom React hook to retrieve the teams in a sleeper league
     * 
     * @param {string} league_id - the id of the league
     * 
     * @returns {object} - An object containing the teams, error and loading state
     */
    const [teams, setTeams] = useState<TeamInfo[] | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setError("")
                setLoading(true)
                const res = await getTeamInfo(league_id)
                if (res) {
                    const reqAvatars = await Promise.allSettled(res.map((team) => (team && team.avatar) && getAvatar(team.avatar)))
                    const resAvatars = reqAvatars.map((result) => result.status == 'fulfilled' ? result.value : "")
                    const teams_with_avatar = res.map((team, index) => ({ ...team, avatar: resAvatars[index] }))
                    setTeams(teams_with_avatar)
                }
            }
            catch (e: any) {
                setError("An error occured")
                // setError(e.message)
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
    }, [league_id])

    return { loading, error, teams }
}
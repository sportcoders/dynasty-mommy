import { apiGet } from './apiClient';
import { getPlayer } from './player'
import type { League, LeagueInfo, Roster, User, Player, Players } from './types';

export const getLeaguesForUser = async (username: string, season: string): Promise<League[]> => {
    const user: User = await apiGet(`/user/${username}`)
    return apiGet<League[]>(`/user/${user.user_id}/leagues/nba/${season}`);
}

export const getRosters = async (leagueId: string): Promise<Roster[]> => {
    return await apiGet<Roster[]>(`/league/${leagueId}/rosters`)
}


export const getLeagueInfo = async (leagueId: string): Promise<LeagueInfo> => {
    return await apiGet<LeagueInfo>(`/league/${leagueId}`)
}

export const getPlayersForRosters = async (leagueId: string): Promise<Player[]> => {
    const roster = await getRosters(leagueId)
    const playerIds = roster.flatMap(roster => roster.players)
    const uniquePlayerIds = Array.from(new Set(playerIds))
    const idsString = uniquePlayerIds.join('&')

    const res: Players = await getPlayer(idsString);

    return res.players;
}

interface leagueUser {
    user_id: string,
    username: string,
    display_name: string,
    avatar: string
    metadata: {
        team_name: string
    }
}
interface TeamSettings {
    username: string,
    display_name: string,
    avatar: string,
    owner_id: string,
    settings: {
        wins: number,
        losses: number,
        ties: number
    }
}
export interface TeamInfo {
    record: {
        wins: number,
        losses: number,
        ties: number
    },
    team_name: string,
    user_id: string | null,
    username: string | null,
    display_name: string | null,
    avatar: string | null
}
export const getTeamInfo = async (leagueId: string): Promise<TeamInfo[]> => {
    const rosters = await apiGet<TeamSettings[]>(`/league/${leagueId}/rosters`)
    const users = await apiGet<leagueUser[]>(`/league/${leagueId}/users`)
    console.log(rosters)
    console.log(users)
    //returns array of dict, dict constains users
    const res: TeamInfo[] = rosters.map((roster) => {
        let team_name = ""
        const user = users.find(u => u.user_id == roster.owner_id)

        return {
            // players: roster.players,
            record: roster.settings,
            user_id: user ? user.user_id : null,
            team_name: team_name,
            display_name: user ? user.display_name : null,
            username: user ? user.username : null,
            avatar: user ? user.avatar : null,
        }
    })

    return res

}
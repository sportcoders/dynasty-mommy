import { sleeper_apiGet } from './apiClient';
import { sleeper_getPlayer } from './player'
import type { League, LeagueInfo, Roster, User, Player, Players, TeamInfo } from '@services/sleeper/types';

export const sleeper_getLeagues = async (username: string, season: string): Promise<League[]> => {
    const user: User = await sleeper_apiGet(`/user/${username}`)
    return sleeper_apiGet<League[]>(`/user/${user.user_id}/leagues/nba/${season}`);
}

export const sleeper_getRosters = async (leagueId: string): Promise<Roster[]> => {
    return await sleeper_apiGet<Roster[]>(`/league/${leagueId}/rosters`)
}

export const sleeper_getPlayers = async (leagueId: string): Promise<Record<string, Player[]>> => {
    const rosters = await sleeper_getRosters(leagueId)
    const playerIds = rosters.flatMap(roster => roster.players)
    const uniquePlayerIds = Array.from(new Set(playerIds))
    const idsString = uniquePlayerIds.join('&')

    const res: Players = await sleeper_getPlayer(idsString);

    const playerMap: Record<string, Player> = {}
    for (const player of res.players) {
        playerMap[player.id] = player;
    }

    const ownerToPlayers: Record<string, Player[]> = {};
    for (const roster of rosters) {
        ownerToPlayers[roster.owner_id] = roster.players.map(pid => playerMap[pid]).filter(Boolean)
    }

    return ownerToPlayers;
}
export const sleeper_getPlayersForRoster = async (leagueId: string, owner_id: string): Promise<Player[]> => {
    const rosters = await sleeper_getRosters(leagueId)
    console.log(rosters)
    const roster = rosters.filter((roster) => roster.owner_id == owner_id)
    console.log(roster)
    const playerIds = roster.flatMap((roster) => roster.players)

    const queryString = playerIds.join("&")

    const players = await sleeper_getPlayer(queryString)

    return players.players
}
export const getLeagueInfo = async (leagueId: string): Promise<LeagueInfo> => {
    return await sleeper_apiGet<LeagueInfo>(`/league/${leagueId}`)
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
    roster_id: number
}


export const getTeamInfo = async (leagueId: string): Promise<TeamInfo[]> => {
    const promises = await Promise.allSettled([
        sleeper_apiGet<TeamSettings[]>(`/league/${leagueId}/rosters`),
        sleeper_apiGet<leagueUser[]>(`/league/${leagueId}/users`)
    ])
    const [rosters, users]: [TeamSettings[], leagueUser[]] = promises.map((result) =>
        result.status == 'fulfilled' ? result.value : []
    ) as [TeamSettings[], leagueUser[]]

    //returns array of dict, dict constains users
    const res: TeamInfo[] = rosters.map((roster) => {
        const user = users.find(u => u.user_id == roster.owner_id)

        return {
            // players: roster.players,
            record: roster.settings,
            user_id: user ? user.user_id : null,
            team_name: user ? user.metadata.team_name : "Unassigned",
            display_name: user ? user.display_name : null,
            username: user ? user.username : null,
            avatar: user ? user.avatar : null,
            roster_id: roster.roster_id
        }
    })

    return res

}


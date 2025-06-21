import { sleeper_apiGet } from './apiClient';
import { sleeper_getPlayer } from './player'
import type { League, LeagueInfo, Roster, User, Player } from './types';

export const sleeper_getLeagues = async (username: string, season: string): Promise<League[]> => {
    const user: User = await sleeper_apiGet(`/user/${username}`)
    return sleeper_apiGet<League[]>(`/user/${user.user_id}/leagues/nba/${season}`);
}

/**
 * Function to get rosters from the Sleeper API.
 *  
 * @param leagueId the numerical league id
 * @returns an array of Roster objects or null
 */
export const sleeper_getRosters = async (leagueId: string): Promise<Roster[] | null> => {
    const rosters = await sleeper_apiGet<Roster[]>(`/league/${leagueId}/rosters`)

    if (rosters) {
        return rosters.map((roster: Roster) => ({
            owner_id: roster.owner_id,
            players: roster.players
        }))
    }

    return null
}

/**
 * Function to get players from the combination of the Sleeper API and backend API.
 * 
 * @param leagueId the numerical id of the league
 * @returns a record with owner ids and its corresponding array of Player objects or null
 */
export const sleeper_getPlayers = async (leagueId: string): Promise<Record<string, Player[]> | null> => {
    const rosters = await sleeper_getRosters(leagueId)

    if (!rosters) {
        return null
    }

    const playerIds = rosters.flatMap(roster => roster.players)
    const uniquePlayerIds = Array.from(new Set(playerIds))
    const idsString = uniquePlayerIds.join('&')

    const players = await sleeper_getPlayer(idsString);

    if (!players) {
        return null
    }

    const playerMap: Record<string, Player> = {}

        for (const player of players) {
            playerMap[player.id] = player;
        }

        const ownerToPlayers: Record<string, Player[]> = {};
        for (const roster of rosters) {
            ownerToPlayers[roster.owner_id] = roster.players.map(pid => playerMap[pid]).filter(Boolean)
        }

        return ownerToPlayers;
}

/**
 * Function to get players for a certain team in a league from the combination of the Sleeper API and backend API.
 * 
 * @param leagueId the numerical id of the league
 * @param owner_id the numerical id of the team's owner
 * @returns an array of Player objects or null
 */
export const sleeper_getPlayersForRoster = async (leagueId: string, owner_id: string): Promise<Player[] | null> => {
    const rosters = await sleeper_getRosters(leagueId)

    if (!rosters) {
        return null
    }

    const roster = rosters.filter((roster) => roster.owner_id == owner_id)
    const playerIds = roster.flatMap((roster) => roster.players)

    const queryString = playerIds.join("&")

    const players: Player[] | null = await sleeper_getPlayer(queryString)

    return players
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


import { apiGet } from './apiClient';
import { getPlayer} from './player'
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
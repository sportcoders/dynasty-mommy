import { apiGet } from './apiClient';
import type { League, Roster, User } from './types';

export const getLeaguesForUser = async (username: string, season: string): Promise<League[]> => {
    const user: User = await apiGet(`/user/${username}`)
    return apiGet<League[]>(`/user/${user.user_id}/leagues/nba/${season}`);
}

export const getRosters = async (leagueId: string): Promise<Roster[]> => {
    return await apiGet<Roster[]>(`/league/${leagueId}/rosters`)
}


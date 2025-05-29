import { apiGet } from './apiClient';
import type { League, Roster } from './types';

export const getLeaguesForUser = async (userId: string, season: string): Promise<League[]> => {
    return apiGet<League[]>(`/user/${userId}/leagues/nba/${season}`);
}

export const getRosters = async (leagueId: string): Promise<Roster[]> => {
    return await apiGet<Roster[]>(`/league/${leagueId}/rosters`)
}


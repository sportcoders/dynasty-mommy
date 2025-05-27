import { apiGet } from './apiClient';
import type { League } from './types';

export const getLeaguesForUser = async (userId: string, season: string): Promise<League[]> => {
    return apiGet<League[]>(`/user/${userId}/leagues/nba/${season}`);
}
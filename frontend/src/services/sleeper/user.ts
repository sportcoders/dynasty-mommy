import { apiGet } from './apiClient';
import type { User } from './types';

export const getUser = async (username: string): Promise<User> => {
    return apiGet<User>(`/user/${username}`);
}
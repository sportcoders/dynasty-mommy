import { sleeper_apiGet } from './apiClient';
import type { User } from './types';

export const getUser = async (username: string): Promise<User> => {
    return sleeper_apiGet<User>(`/user/${username}`);
}
import { sleeper_apiGet } from './apiClient';
import type { User } from './types';

export const sleeper_getUser = async (username: string): Promise<User> => {
    return sleeper_apiGet<User>(`/user/${username}`);
}
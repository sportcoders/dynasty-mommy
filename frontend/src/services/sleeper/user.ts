import { sleeper_apiGet } from './apiClient';
import type { User } from './types';

/**
 * Function to get user via username from the Sleeper API.
 * 
 * @param username the username input
 * @returns a User obect or null
 */
export const sleeper_getUser = async (username: string): Promise<User | null> => {
    try {
        const user = await sleeper_apiGet<User>(`/user/${username}`);
        return {
            username: user.username,
            user_id: user.user_id,
            display_name: user.display_name,
            avatar: user.avatar
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null; 
    }
};
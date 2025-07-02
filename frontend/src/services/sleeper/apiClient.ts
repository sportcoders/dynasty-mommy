const BASE_URL = 'https://api.sleeper.app/v1';
const SERVER_BASE_URL = 'http://localhost:8000'
const AVATAR_URL = 'https://sleepercdn.com/avatars'
export const sleeper_apiGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}?ts=${Date.now()}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const serverGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`)

    return response.json() as Promise<T>
}

export const sleeper_avatarGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${AVATAR_URL}${endpoint}`)


    return response.blob() as Promise<T>
}
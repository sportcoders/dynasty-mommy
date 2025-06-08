const BASE_URL = 'https://api.sleeper.app/v1';
const SERVER_BASE_URL = 'http://localhost:8000'
const AVATAR_URL = 'https://sleepercdn.com/avatars'
export const apiGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export const serverGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`)

    return response.json() as Promise<T>
}

export const avatarGet = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${AVATAR_URL}${endpoint}`)


    return response.blob() as Promise<T>
}
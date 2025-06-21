import { sleeper_avatarGet } from "./apiClient";

/**
 * Function to get avatar from the Sleeper API.
 * 
 * @param avatar_id the numerical id of the avatar
 * @returns a Blob object of the avatar or null
 */
export async function sleeper_getAvatarThumbnail(avatar_id: string): Promise<Blob | null> {
    try {
        const avatar: Blob = await sleeper_avatarGet(`/thumbs/${avatar_id}`)

        return avatar   
    } catch (error) {
        console.error('Failed to fetch avatar:', error);
        return null; 
    }
}


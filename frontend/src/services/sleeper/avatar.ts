import { sleeper_avatarGet } from "./apiClient";

export async function sleeper_getAvatarThumbnail(avatar_id: string): Promise<Blob> {
    return await sleeper_avatarGet(`/thumbs/${avatar_id}`)
}


import { sleeper_avatarGet } from "./apiClient";

export async function sleeper_getAvatarThumbnail(avatar_id: string): Promise<Blob | null> {
    const res: Blob | null = await sleeper_avatarGet(`/thumbs/${avatar_id}`)

    return res
}


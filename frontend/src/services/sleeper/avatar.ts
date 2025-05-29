import { avatarGet } from "./apiClient";

export async function getAvatarThumbnail(avatar_id: string): Promise<Blob> {
    return await avatarGet(`/thumbs/${avatar_id}`)
}
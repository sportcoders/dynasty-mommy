import { sleeper_getAvatarThumbnail } from "@services/sleeper";
import { useEffect, useState } from "react";

export default function useGetAvatar(avatars_input: string | undefined) {
    if (!avatars_input) return
    const [avatars, setAvatars] = useState<string[]>([])
    useEffect(() => {
        const loadAvatars = async () => {
            const getAvatar = async (avatar_id: string) => {

                const blob = await sleeper_getAvatarThumbnail(avatar_id)

                if (!blob || !(blob instanceof Blob)) {
                    throw new Error(`Invalid blob received for avatar ID: ${avatar_id}`);
                }
                const url = URL.createObjectURL(blob)
                return url

            }
            const avatarList = avatars_input.split("&")
            const requests = avatarList.map((avatar_id) => getAvatar(avatar_id))
            const promises = await Promise.allSettled(requests)
            const avatar_array = promises.map((result) =>
                result.status == 'fulfilled' ? result.value : "error"
            )
            setAvatars(avatar_array)
        }
        loadAvatars()

        return () => {
            avatars.forEach((url) => URL.revokeObjectURL(url));
        }
    }, [avatars])

    return { avatars }
}
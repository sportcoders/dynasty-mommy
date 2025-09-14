import useGetAvatar from "@hooks/useGetAvatar";
import { Avatar, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type DisplayAvatarProps = {
    avatar_url: string,
    platform: "sleeper" | "yahoo",
    size?: number,
};
export function DisplayAvatar({ avatar_url, platform, size }: DisplayAvatarProps) {
    const { data: blob } = useGetAvatar({ url: avatar_url, platform: platform });
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const previousBlobUrl = useRef<string | null>(null);

    const theme = useTheme();

    useEffect(() => {
        if (blob) {
            const new_avatar = URL.createObjectURL(blob);
            setBlobUrl(new_avatar);

            if (previousBlobUrl.current)
                URL.revokeObjectURL(previousBlobUrl.current);

            previousBlobUrl.current = new_avatar;
        }
        return () => {
            if (previousBlobUrl.current)
                URL.revokeObjectURL(previousBlobUrl.current);
        };
    }, [blob]);

    return (
        <Avatar
            src={blobUrl ?? undefined}
            sx={{
                width: size ?? 60,
                height: size ?? 60,
                boxShadow: theme.shadows[3],
            }}
        />
    );
}
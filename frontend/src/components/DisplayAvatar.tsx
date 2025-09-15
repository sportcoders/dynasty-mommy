import { Avatar, useTheme } from "@mui/material";

type DisplayAvatarProps = {
    avatar_url?: string,
    platform: "sleeper" | "yahoo",
    size?: number,
};
const SLEEPER_AVATAR_ENDPOINT = import.meta.env.VITE_SLEEPER_AVATAR_URL;

export function DisplayAvatar({ avatar_url, platform, size }: DisplayAvatarProps) {
    const theme = useTheme();

    return (
        <Avatar
            src={platform == "sleeper" ? `${SLEEPER_AVATAR_ENDPOINT}/${avatar_url}` : avatar_url}
            sx={{
                width: size ?? 60,
                height: size ?? 60,
                boxShadow: theme.shadows[3],
            }}
        />
    );
}
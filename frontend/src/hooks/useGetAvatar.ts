import { sleeper_getAvatarThumbnail } from "@services/sleeper";
import { useQuery } from "@tanstack/react-query";

type AvatarFetchProps = {
    url: string,
    platform: "sleeper" | "yahoo";
};

export default function useGetAvatar({ url, platform }: AvatarFetchProps) {
    const { data, isPending, isError } = useQuery({
        queryKey: ['avatar', url, platform],
        queryFn: async () => {
            switch (platform) {
                case "sleeper": return sleeper_getAvatarThumbnail(url);
                case "yahoo": {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    return blob;
                }
                default:
                    throw new Error(`Unknown avatar source: ${url}`);
            }
        }
    });
    return { data, isPending, isError };
}
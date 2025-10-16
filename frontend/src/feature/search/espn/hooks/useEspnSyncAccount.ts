// -------------------- Imports -------------------
import { syncAccount } from "@services/espn/sync";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EspnCookiePayload } from "@services/espn/types";
import { useNotification } from "@hooks/useNotification";

/**
 * Custom React hook that syncs ESPN account using manual cookie entry.
 * 
 * @param onSuccessCallback - Success callback function when query is a success
 * 
 * @returns An object containing sync account call, loading state, error state, and success state
 */
export default function useEspnSyncAccount(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: (payload: EspnCookiePayload) => syncAccount(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['espnSyncStatus'] });
            showSuccess("ESPN Account Synced");
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: () => {
            showError("Failed Sync ESPN Account");
        }
    });

    return { mutate, isPending, isError, isSuccess };
}


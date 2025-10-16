// -------------------- Imports -------------------
import { syncAccount } from "@services/espn/sync";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EspnCookiePayload } from "@services/espn/types";
import { useNotification } from "@hooks/useNotification";

/**
 * Custom React hook that retrieves ESPN sync status.
 * 
 * @param payload - ESPN Cookie Type (espn_s2, SWID)
 * 
 * @returns An object containing the sync status, loading status, and error status
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


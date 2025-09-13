import { useNotification } from "@hooks/useNotification";
import { unlinkYahooAccount } from "@services/api/yahoo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUnlinkAccount() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useNotification();

    const { mutate, isPending: loading, isError: error, isSuccess: success } = useMutation({
        mutationFn: unlinkYahooAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yahooLeagues'] });
            showSuccess("Yahoo account unlinked");
        },
        onError: (err) => {
            console.log(err);
            showError("Failed to unlink account");
        }
    });
    return { mutate, loading, error, success };
}
import { useNotification } from "@hooks/useNotification";
import { changeUsername } from "@services/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@app/hooks";
import { login } from "@feature/auth/authSlice";

//sends a request to backend, needs to check if current password is valid
export default function useChangeUsername() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const { showSuccess, showError } = useNotification();
    const { mutate, isPending: loading, error, } = useMutation({
        mutationFn: (username: string) => changeUsername(username),
        onSuccess: (_, username) => {
            queryClient.invalidateQueries({ queryKey: ['DM_USER_PROFILE'] });
            console.log(username);
            dispatch(login(username));
            showSuccess("Username Changed");
        },
        onError: () => {
            showError("Error Changing Username");
        }
    });
    return { mutate, loading, error };
}
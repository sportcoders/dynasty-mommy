import { useAppSelector } from "@app/hooks";

export default function isLoggedIn() {
    const loggedIn = useAppSelector((state) => state.auth.username);
    return loggedIn != null;
}
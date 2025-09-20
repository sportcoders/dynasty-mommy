import { serverDelete, serverGet, serverPost } from "@services/sleeper";

interface User {
    username: string;
}
export interface UserLeague {
    platform: "sleeper" | "yahoo";
    league_id: string;
}

export async function loginUser(email: string, password: string) {
    try {
        const user = await serverPost("/auth/login", {
            email: email,
            password: password,
        });
        return user as User;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function createUser(
    username: string,
    email: string,
    password: string
) {
    try {
        const user = await serverPost("/auth/signup", {
            username: username,
            email: email,
            password: password,
        });
        return user as User;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function fetchUserLeagues() {
    try {
        const response = await serverGet<{ leagues: UserLeague[]; }>("/user/leagues");
        return response;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function logoutUser() {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, { method: "POST", credentials: "include" });
}

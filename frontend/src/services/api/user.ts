import { serverGet, serverPost } from "@services/sleeper";
interface User {
    username: string;
}
export async function loginUser(email: string, password: string) {
    try {
        const user = await serverPost("/auth/login", {
            email: email,
            password: password,
        });
        console.log(user);
        return user as User;
    } catch (e) {
        console.log(e);
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
    }
}
export interface League {
    platform: string;
    league_id: string;
}
export async function addLeagueToUser(newLeague: League) {
    try {
        await serverPost("/user/addLeague", { league: newLeague });
    } catch (e) {
        console.error(e);
    }
}
export interface UserLeagues {
    leagues: League[];
}
export async function fetchUserLeagues() {
    try {
        const response = await serverGet<UserLeagues>("/user/getLeagues");
        return response;
    } catch (e) {
        console.error(e);
    }
}

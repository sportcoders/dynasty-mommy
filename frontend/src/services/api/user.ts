import { serverDelete, serverGet, serverPost } from "@services/sleeper";
interface User {
    username: string;
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

export async function removeLeagueFromUser(league: League) {
    try {
        await serverDelete(`/sleeper_league/${league.league_id}`);
    } catch (e) {
        console.error(e);
    }
}

export async function isUserLeague(league: League) {
    try {
        const check = await serverGet(`/user/isUserLeague/${league.league_id}/${league.platform}`);
        return check as boolean;
    } catch (e) {
        console.error(e);
    }
}
export interface UserLeagues {
    leagues: League[];
}

export async function fetchUserLeagues() {
    try {
        const response = await serverGet<UserLeagues>("/sleeper_league/");
        return response;
    } catch (e) {
        console.error(e);
    }
}

export async function saveSleeperLeague({ league_id, user_id }: savedTeam) {
    try {
        const response = await serverPost('/sleeper_league/', {
            league: {
                league_id: league_id,
                user_id: user_id
            }
        });

        return response;
    }
    catch (e) {
        console.log(e);
    }
}

interface savedTeam {
    league_id: string,
    user_id?: string,
    platform?: string;
}
interface savedTeamResponse {
    league_id: string,
    saved_user: string,
    platform?: string;
}
export async function getSavedTeams() {
    try {
        const response = await serverGet<savedTeamResponse[]>('/sleeper_league/');
        return response;
    }
    catch (e) {
        console.log(e);
    }
}

export async function getSavedTeamSleeperLeague(league_id: string) {
    try {
        const response = await serverGet<savedTeamResponse>(`/sleeper_league/${league_id}`);
        return response;
    }
    catch (e) {
        console.log(e);
    }
}
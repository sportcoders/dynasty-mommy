import { serverDelete, serverGet, serverPost } from "@services/sleeper";
import type { UserLeague } from "@services/api/user";

export interface saveSleeperTeam {
    league_id: string,
    user_id?: string,
}
export interface savedSleeperTeamResponse {
    league_id: string,
    saved_user: string,
    platform?: string;
}

export async function removeLeagueFromUser(league: UserLeague) {
    try {
        await serverDelete(`/sleeper_league/${league.league_id}`);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function isUserLeague(league: UserLeague) {
    try {
        const response = await serverGet<savedSleeperTeamResponse>(`/sleeper_league/${league.league_id}`);
        return !!response;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function saveSleeperLeague({ league_id, user_id }: saveSleeperTeam) {
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
        throw e;
    }
}

export async function getSavedTeams() {
    try {
        const response = await serverGet<savedSleeperTeamResponse[]>('/sleeper_league/');
        return response;
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export async function getSavedTeamSleeperLeague(league_id: string) {
    const response = await serverGet<savedSleeperTeamResponse>(`/sleeper_league/${league_id}`);
    return response;

}

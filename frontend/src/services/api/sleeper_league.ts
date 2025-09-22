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
type SleeperTradeMarket = {
    _id: string,
    status_updated: number,
    trades: Trade[];
};
type Player = {
    first_name: string;
    last_name: string;
};

type Trade = Player[];
export async function getTradeMarket({ searchText, limit }: { searchText?: string, limit?: number; } = {}) {
    let params = "?";
    if (searchText)
        params += `searchText=${searchText}&`;
    if (limit)
        params += `limit=${limit}`;

    const response = await serverGet<SleeperTradeMarket[]>(`/sleeper_trade_market${params}`);
    return response;
}
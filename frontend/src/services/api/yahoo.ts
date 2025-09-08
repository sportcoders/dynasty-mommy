import { serverGet } from "@services/sleeper";

type YahooInitOauthResponse = {
    url: string;
};
export async function start_oauth(): Promise<YahooInitOauthResponse> {
    // const response = await serverGet<YahooInitOauthResponse>("/yahoo/oauth/start");
    // return response as YahooInitOauthResponse;
    const response = await fetch("/dm/yahoo/oauth/start", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    return response.json() as Promise<YahooInitOauthResponse>;
}

type YahooGetLeaguesResponse = {
    leagues: YahooLeague[];
};
export type YahooLeague = {
    current_week: number,
    end_week: number,
    game_code: string,
    league_id: number,
    league_key: string,
    league_type: string,
    logo_url: string,
    matchup_week: number,
    name: string,
    num_teams: number,
    season: number,
    start_week: number,
    url: string,
    start_date: string,
    end_date: string;
};

export async function getLeagues() {
    const response = await serverGet<YahooGetLeaguesResponse>('/yahoo/leagues');
    return response!.leagues;
}

export async function getTeamsInLeague(league_key: string) {
    const response = await serverGet(`/yahoo/leagues/${league_key}/teams`);
    return response;
}
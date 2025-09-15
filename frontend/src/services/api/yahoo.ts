import { ServerError } from "@app/utils/errors";
import { serverDelete, serverGet, serverPost } from "@services/sleeper";

type YahooInitOauthResponse = {
    url: string;
};
export async function start_oauth(): Promise<YahooInitOauthResponse> {
    const response = await serverGet<YahooInitOauthResponse>("/yahoo/oauth/start");
    return response as YahooInitOauthResponse;

    // const response = await fetch("/dm/yahoo/oauth/start", {
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    // });

    // return response.json() as Promise<YahooInitOauthResponse>;
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
    try {
        const response = await serverGet<YahooGetLeaguesResponse>('/yahoo/leagues');
        return response!.leagues;
    }
    catch (e: any) {
        if (e instanceof ServerError) {
            if (e.statusCode == 403) {
                return 'No Yahoo League Linked with this account, please link an account to find leagues';
            }
            else if (e.statusCode == 401) {
                throw new ServerError(e.statusCode, "Yahoo OAuth failed, please try again");
            }
        }
        else throw e;
    }
}
export type getTeamsAndLeagueResponse = {
    allow_add_to_dl_extra_pos: number;
    current_date: string;
    current_week: number;
    draft_status: "predraft" | string;
    edit_key: string;
    end_date: string;
    end_week: number;
    felo_tier: "bronze" | "silver" | "gold" | string;
    game_code: string;
    iris_group_chat_id: string;
    is_cash_league: number;
    is_highscore: string | number;
    is_plus_league: number;
    is_pro_league: number;
    league_id: number;
    league_key: string;
    league_type: "public" | "private" | string;
    league_update_timestamp: string;
    logo_url: string;
    matchup_week: number;
    name: string;
    num_teams: number;
    renew: string;
    renewed: string;
    roster_type: string;
    scoring_type: "headpoint" | "category" | string;
    season: number;
    short_invitation_url: string;
    start_date: string;
    start_week: number;
    standings: {
        teams: {
            team:
            YahooTeamWithStandings[] | YahooTeamWithStandings;
        };
    };
    teams: {
        team: YahooTeam[] | YahooTeam;
    };

};
interface YahooTeam {
    has_draft_grade: number;
    league_scoring_type: string;
    managers: { manager: YahooManager | YahooManager[]; }; //can normalize to an array
    name: string;
    number_of_moves: number;
    number_of_trades: number;
    roster_adds: {
        coverage_type: string;
        coverage_value: number;
        value: number;
    };
    team_id: number;
    team_key: string;
    team_logos: {
        team_logo: YahooTeamLogo[] | YahooTeamLogo;
    };
    url: string;
    waiver_priority: string;
};
export interface YahooTeamWithStandings extends YahooTeam {
    team_standings: {
        outcome_totals: {
            wins: number;
            losses: number;
            ties: number;
            percentage: string;
        };
        points_for: number;
        points_against: number;
        rank: string;
    };
}
type YahooManager = {
    email: string;
    guid: string;
    image_url: string;
    manager_id: number;
    nickname: string;
    is_current_login?: number;
};
type YahooTeamLogo = {
    size: string;
    url: string;
};
interface YahooTeamWithRoster extends YahooTeam {
    team: {
        roster: {
            players: {
                player: YahooPlayer[];
            };
        };
    };
}
interface YahooPlayer {
    player_key: string;
    player_id: string;
    name: {
        full: string;
        first: string;
        last: string;
    };
    editorial_team_abbr: string;
    display_position: string;
    primary_position: string;
    eligible_positions: string[];
}
export async function getLeagueAndTeams(league_key: string) {
    const response = await serverGet<getTeamsAndLeagueResponse>(`/yahoo/leagues/${league_key}/teams`);
    return response as getTeamsAndLeagueResponse;
}

export async function getRosterForTeam(team_key: string) {
    const response = await serverGet<YahooTeamWithRoster>(`/yahoo/roster/${team_key}`);
    return response;
}
export async function unlinkYahooAccount() {
    await serverDelete('/yahoo/unlink');
}

export type LeagueYahooParams = {
    league_key: string,
    team_key?: string;
};
export async function saveYahooLeague(league: LeagueYahooParams) {
    await serverPost('/yahoo/league', { league: league });
}
export async function removeYahooLeague(league_key: string) {
    await serverDelete(`/yahoo/league/${league_key}`);
}
export async function getSavedYahooLeague(league_key: string) {
    const response = await serverGet<LeagueYahooParams>(`/yahoo/league/${league_key}`);
    return response;
}
interface SavedLeagueResponse {
    league_key: string,
    platform?: string;
    team_key?: string;
}
export async function getAllSavedYahooLeague() {
    const response = await serverGet<SavedLeagueResponse[]>(`/yahoo/league/allSaved`);
    return response;
}

export type YahooTransaction = {
    players: {
        player: YahooTransactionPlayer[],
    },
    status: string,
    timestamp: number,
    transaction_id: number,
    transaction_key: string,
    type: string;
};

export async function getTransactions(league_key: string) {
    const response = await serverGet<{ transactions: { transaction: YahooTransaction[]; }; }>(`/yahoo/league/${league_key}/transactions`);
    return response?.transactions.transaction ?? null;

}
export interface YahooTransactionPlayer extends YahooPlayer {
    transaction_data: {
        destination_team_key: string;
        destination_team_name: string;
        destination_type: string;
        source_type: string;
        source_team_key: string;
        source_team_name: string;
        type: string;
    };
}
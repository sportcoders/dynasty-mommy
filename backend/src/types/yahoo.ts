import { Request } from "express";
export type YahooTokens = {
    refresh_token: string;
    access_token: string;
    access_token_expiry?: Date;
};
export interface YahooTokenRequest extends Request {
    yahooTokens?: YahooTokens;
}
interface YahooTeam {
    has_draft_grade: number;
    league_scoring_type: string;
    managers: YahooManager | YahooManager[]; //can normalize to an array
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
interface YahooTeamWithStandings extends YahooTeam {
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
export type YahooTransaction = {
    players: {
        player: YahooTransactionPlayer[] | YahooTransactionPlayer,
    },
    status: string,
    timestamp: number,
    transaction_id: number,
    transaction_key: string,
    type: string;
};
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
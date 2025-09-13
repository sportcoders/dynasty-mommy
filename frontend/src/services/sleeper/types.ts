export interface League {
    league_id: string;
    name: string;
    season: string;
    avatar: string;
    platform?: string;
}

export interface User {
    username: string;
    user_id: string;
    display_name: string;
    avatar: string;
}

export interface Roster {
    owner_id: string;
    players: string[];
    roster_id: number;
}

export interface Player {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
}

export interface Players {
    players: Player[];
}

export interface LeagueInfo {
    name: string,
    status: string,
    avatar: string,
    sport: string,
    season: string,
    previous_league_id: string,
    settings: {
        num_teams: number,
        last_scored_leg?: number,
    };
    scoring_settings: {
        ast: number,
        blk: number,
        bonus_pt_40p: number,
        bonus_pt_50: number,
        dd: number,
        ff: number,
        fga: number,
        fgm: number,
        fgmi: number,
        oreb: number,
        pts: number,
        stl: number,
        reb: number,
        td: number,
        tf: number,
        to: number,
        tpm: number,
        ftm: number,
    },
    roster_positions: string[];
}
export interface TeamInfo {
    record: {
        wins: number,
        losses: number,
        ties: number;
    },
    team_name: string,
    user_id: string | null,
    username: string | null,
    display_name: string | null,
    avatar: string | null;
    roster_id: number;
}
export interface State {
    week: number,
    leg: number,
    season: string,
    display_week: number,
    league_season: string,
    previous_season: string;
}
export interface Transaction {
    type: string,
    transaction_id: string,
    status: string,
    roster_ids: number[],
    leg: number,
    draft_picks: sleeper_draftPick[],
    creator: string,
    consenter_ids: [],
    waiver_budget: [],
    drops: {},
    adds: {},
    status_updated: string;
}

export interface sleeper_draftPick {
    season: string,
    round: number,      // which round this draft pick is
    roster_id: number,  // original owner's roster_id
    previous_owner_id: number,  // previous owner's roster id (in this trade)
    owner_id: number,   // the new owner of this pick after the trade
}
export interface League {
    league_id: string;
    name: string;
    season: string;
    avatar: string;
}

export interface User {
    username: string;
    user_id: string;
    display_name: string;
    avatar: string;
}

export interface Roster {
    owner_id: string;
    players: string[]
}

export interface Player {
    first_name: string;
    last_name: string;
}

export interface Players {
    players: Player[];
}

export interface LeagueInfo {
    name: string,
    status: string,
    settings: {
        num_teams: number,

    }
    sport: string,
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
    roster_positions: String[]
}
type getTeamsAndLeagueResponse = {
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
            YahooTeamWithStandings[];
        };
    };
    teams: {
        team: YahooTeam[];
    };

};
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
    roster: {
        players: {
            count: number;
            player: YahooPlayer;
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
    eligible_positions: string[];
    selected_position: {
        coverage_type: string;
        position: string;
    };
}
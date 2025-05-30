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
    last_name: string
}

export interface Players {
    players: Player[];
}
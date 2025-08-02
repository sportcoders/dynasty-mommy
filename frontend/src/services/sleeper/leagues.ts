import { sleeper_apiGet } from './apiClient';
import { sleeper_getPlayer } from './player';
import { sleeper_getUser } from "@services/sleeper";
import type { League, LeagueInfo, Roster, Player, TeamInfo, Transaction, State } from '@services/sleeper/types';


/**
 * Function to get leauges form a user from the Sleeper API.
 * 
 * @param username the username input
 * @param season the season year input
 * @returns an array of Leage objects 
 */
export const sleeper_getLeagues = async (username: string, season: string): Promise<League[]> => {
    const user = await sleeper_getUser(username);

    if (!user) {
        return [];
    }

    const leagues = await sleeper_apiGet<League[]>(`/user/${user.user_id}/leagues/nba/${season}`);

    if (leagues === null || leagues === undefined || leagues.length === 0) {
        return [];
    }

    return leagues.map((league: League) => ({
        league_id: league.league_id,
        name: league.name,
        season: league.season,
        avatar: league.avatar
    }));
};

/**
 * Function to get rosters from the Sleeper API.
 *  
 * @param leagueId the numerical league id
 * @returns an array of Roster objects
 */
export const sleeper_getRosters = async (leagueId: string): Promise<Roster[]> => {
    const rosters = await sleeper_apiGet<Roster[]>(`/league/${leagueId}/rosters`);

    if (rosters === null || rosters === undefined || rosters.length === 0) {
        return [];
    }

    return rosters.map((roster: Roster) => ({
        owner_id: roster.owner_id,
        players: roster.players,
        roster_id: roster.roster_id
    }));
};

/**
 * Function to get players from the combination of the Sleeper API and backend API.
 * 
 * @param leagueId the numerical id of the league
 * @returns a record with owner ids and its corresponding array of Player objects or null
 */
export const sleeper_getPlayers = async (leagueId: string): Promise<Record<string, Player[]> | null> => {
    const rosters = await sleeper_getRosters(leagueId);

    if (rosters === null || rosters === undefined || rosters.length === 0) {
        return null;
    }

    const playerIds = rosters.flatMap(roster => roster.players);
    const uniquePlayerIds = Array.from(new Set(playerIds));
    const idsString = uniquePlayerIds.join('&');

    const players = await sleeper_getPlayer(idsString);

    if (players === null || players === undefined || players.length === 0) {
        return null;
    }

    const playerMap: Record<string, Player> = {};

    for (const player of players) {
        playerMap[player.id] = player;
    }

    const ownerToPlayers: Record<string, Player[]> = {};
    for (const roster of rosters) {
        ownerToPlayers[roster.owner_id] = roster.players.map(pid => playerMap[pid]).filter(Boolean);
    }

    return ownerToPlayers;
};
//TODO: CHECK IF THIS IS STILL USED
/**
 * Function to get players for a certain team in a league from the combination of the Sleeper API and backend API.
 * 
 * @param leagueId the numerical id of the league
 * @param owner_id the numerical id of the team's owner
 * @returns an array of Player objects
 */
export const sleeper_getPlayersForRoster = async (leagueId: string, owner_id: string): Promise<Player[]> => {
    const rosters = await sleeper_getRosters(leagueId);

    if (rosters === null || rosters === undefined || rosters.length === 0) {
        return [];
    }

    const roster = rosters.find((roster) => roster.owner_id == owner_id);
    const playerIds = roster!.players;

    if (playerIds == null || playerIds == undefined || playerIds.length === 0) {
        return [];
    }

    const queryString = playerIds.join("&");

    const players: Player[] = await sleeper_getPlayer(queryString) || [];

    return players;
};
/**
 * Function to get players for a certain team in a league from the combination of the Sleeper API and backend API.
 * 
 * @param leagueId the numerical id of the league
 * @param roster_id the numerical id of the roster
 * @returns an array of Player objects
 */
export const sleeper_getPlayersForRoster_rosterid = async (leagueId: string, roster_id: number): Promise<Player[]> => {
    const rosters = await sleeper_getRosters(leagueId);

    if (rosters === null || rosters === undefined || rosters.length === 0) {
        return [];
    }

    const roster = rosters.find((roster) => roster.roster_id == roster_id);
    const playerIds = roster!.players;

    if (playerIds == null || playerIds == undefined || playerIds.length === 0) {
        return [];
    }

    const queryString = playerIds.join("&");

    const players: Player[] = await sleeper_getPlayer(queryString) || [];

    return players;
};

/**
 * Function to get league info from the Sleeper API.
 * 
 * @param leagueId the numerical league id
 * @returns a LeagueInfo object or null
 */
export const sleeper_getLeagueInfo = async (leagueId: string): Promise<LeagueInfo | null> => {
    const leagueInfo = await sleeper_apiGet<LeagueInfo>(`/league/${leagueId}`);

    if (!leagueInfo) {
        return null;
    }

    return {
        name: leagueInfo.name,
        status: leagueInfo.status,
        avatar: leagueInfo.avatar,
        previous_league_id: leagueInfo.previous_league_id,
        season: leagueInfo.season,
        settings: {
            num_teams: leagueInfo.settings.num_teams
        },
        sport: leagueInfo.sport,
        scoring_settings: leagueInfo.scoring_settings,
        roster_positions: leagueInfo.roster_positions
    };

};

interface leagueUser {
    user_id: string,
    username: string,
    display_name: string,
    avatar: string;
    metadata: {
        team_name: string;
    };
}
interface TeamSettings {
    username: string,
    display_name: string,
    avatar: string,
    owner_id: string,
    settings: {
        wins: number,
        losses: number,
        ties: number;
    };
    roster_id: number;
}

/**
 * Function to get team info from the Sleeper API.
 * 
 * @param leagueId the numerical league id
 * @returns an array of TeamInfo objects
 */
export const sleeper_getTeamInfo = async (leagueId: string): Promise<TeamInfo[]> => {
    const promises = await Promise.allSettled([
        sleeper_apiGet<TeamSettings[]>(`/league/${leagueId}/rosters`),
        sleeper_apiGet<leagueUser[]>(`/league/${leagueId}/users`)
    ]);
    const [rosters, users]: [TeamSettings[], leagueUser[]] = promises.map((result) =>
        result.status == 'fulfilled' ? result.value : []
    ) as [TeamSettings[], leagueUser[]];

    //returns array of dict, dict constains users
    const res: TeamInfo[] = rosters.map((roster) => {
        const user = users.find(u => u.user_id == roster.owner_id);

        return {
            // players: roster.players,
            record: roster.settings,
            user_id: user ? user.user_id : null,
            team_name: user ? user.metadata.team_name : "Unassigned",
            display_name: user ? user.display_name : null,
            username: user ? user.username : null,
            avatar: user ? user.avatar : null,
            roster_id: roster.roster_id
        };
    });

    return res;

};

export const sleeper_getTradesWeek = async (leagueId: string, round: number) => {
    const transactions = await sleeper_apiGet<Transaction[]>(`/league/${leagueId}/transactions/${round}`);
    if (!transactions) return;

    const trades = transactions.filter((transaction) => transaction.type == "trade");
    return trades;
};

export const sleeper_getTransactionsWeek = async (leagueId: string, round: number) => {
    const transactions = await sleeper_apiGet<Transaction[]>(`/league/${leagueId}/transactions/${round}`);
    return transactions;
};

export const sleeper_getAllLeagueTransactions = async (leagueId: string): Promise<Record<number, Transaction[]>> => {
    const weeks = [];
    for (let i = 1; i < 27; i++) {
        weeks.push(sleeper_apiGet<Transaction[]>(`/league/${leagueId}/transactions/${i}`));
    }
    const promises = await Promise.allSettled(weeks);
    const transactions: Record<number, Transaction[]> = {};
    promises.forEach((promise, index) => {
        if (promise.status == 'fulfilled' && promise.value.length > 0)
            transactions[index + 1] = promise.value;
    });
    return transactions;
};

export const sleeper_get_state = async () => {
    const res = await sleeper_apiGet<State>('/state/nba');

    return {
        week: res.week,
        leg: res.leg,
        season: res.season,
        league_season: res.league_season,
        previous_season: res.previous_season,
        display_week: res.display_week
    };
};
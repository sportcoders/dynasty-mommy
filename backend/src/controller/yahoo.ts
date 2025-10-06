import { NextFunction, Request as ExpressRequest, Response } from "express";
import { XMLParser } from "fast-xml-parser";
import z from "zod";
import { HttpError, HttpSuccess } from "../constants/constants";
import { AppError } from "../errors/app_error";
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../app";
import { YahooToken } from "../models/yahoo_tokens";
import { YahooLeague } from "../models/yahoo_league";
import { mapTransactions } from "../utils/yahoo/yahoo_transaction";
import { refreshAccessToken, updateTokenForUser } from "../middleware/yahooTokenCheck";
import { YahooTokenRequest, YahooTokens } from "../types/yahoo";
import { yahooConfig } from "../config/yahooConfig";

const YAHOO_REDIRECT_URI = yahooConfig.REDIRECT_URI;
const YAHOO_API_URL = yahooConfig.API_URL;
const STATE_SECRET = yahooConfig.STATE_SECRET;
const default_yahoo_values = yahooConfig.defaultValues;
const AUTH_HEADER = yahooConfig.authHeader;

const parser = new XMLParser();


//HELPER FUNCTIONS
async function token_from_code(code: string): Promise<YahooTokens> {
    const body = {
        ...default_yahoo_values,
        code: code,
        grant_type: "authorization_code",
    };
    const response = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
        method: "POST",
        body: new URLSearchParams(body),
        headers: {
            Authorization: `Basic ${AUTH_HEADER}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    if (!response.ok) {
        throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Yahoo authorization failed" });
    }
    return response.json();
}


const params_from_yahoo_redirect = z.object({
    code: z.string(),
    state: z.string()
});
export async function yahoo_callback(req: ExpressRequest, res: Response, next: NextFunction) {
    const { code, state } = params_from_yahoo_redirect.parse(req.query);

    const user = jwt.verify(state, STATE_SECRET) as { user_id: string; };
    const user_id = user.user_id;
    try {
        const tokens = await token_from_code(code);

        await updateTokenForUser(user_id, tokens);

        res.redirect("http://localhost:5173/?platform=yahoo&loggedIn=true");
    }
    catch (e) {
        if (e instanceof AppError && e.statusCode == HttpError.UNAUTHORIZED && e.message == "Yahoo authorization failed")
            res;
    }
}
//DM AUTH REQUIRED
export async function request_oauth(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user?.user_id;

        const state = jwt.sign({
            user_id: user
        },
            STATE_SECRET,
            { expiresIn: '5m' });

        const params = new URLSearchParams({
            client_id: yahooConfig.CONSUMER_KEY,
            redirect_uri: YAHOO_REDIRECT_URI,
            response_type: 'code',
            language: 'en-us',
            state
        });



        const url = `https://api.login.yahoo.com/oauth2/request_auth?${params.toString()}`;

        res.status(HttpSuccess.OK).json({ url: url });
    }
    catch (e) {
        next(e);
    }
}
export async function unlinkYahoo(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user?.user_id;

        const response = await AppDataSource.getRepository(YahooToken).delete({ userId: user });

        if (response.affected == 1) {
            res.status(HttpSuccess.NO_CONTENT).send();
        }
        else {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "unable to unlink account" });
        }
    }
    catch (e) {
        next(e);
    }
}

const YahooSaveTeamParams = z.object({
    league: z.object({
        league_key: z.string()
    })
});
export async function saveLeague(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const { league } = YahooSaveTeamParams.parse(req.body);

        const user_id = req.user?.user_id;

        await AppDataSource.getRepository(YahooLeague).upsert({ userId: user_id, league_key: league.league_key, yahoo_token_userId: user_id }, ['userId', 'league_key']);

        res.status(HttpSuccess.OK).send({ detail: "successful save" });
    }
    catch (e) {
        next(e);
    }
}
const YahooLeagueParams = z.object({
    league_key: z.string()
});
export async function removeLeague(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const { league_key } = YahooLeagueParams.parse(req.params);

        const user_id = req.user?.user_id;

        const response = await AppDataSource.getRepository(YahooLeague).delete({ userId: user_id, league_key: league_key });

        if (response.affected == 1)
            res.status(HttpSuccess.OK).send({ detail: "successful save" });
        else
            throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "unable to remove league" });
    }
    catch (e) {
        next(e);
    }
}
export async function getLeague(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const { league_key } = YahooLeagueParams.parse(req.params);

        const user_id = req.user?.user_id;

        const response = await AppDataSource.getRepository(YahooLeague).findOneBy({ userId: user_id, league_key: league_key });

        res.status(HttpSuccess.OK).json(response);
    }
    catch (e) {
        next(e);
    }
}
export async function getAllYahooLeagues(user_id: string, league_key_name: "league_key" | "league_id") {
    const leagues = await AppDataSource.getRepository(YahooLeague).createQueryBuilder("league")
        .select([
            `league.league_key AS "${league_key_name}"`,
            "'yahoo' AS platform"
        ])
        .where("league.userId = :user_id", { user_id })
        .getRawMany();
    return leagues;
}
export async function getAllSavedYahooLeague(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user?.user_id;
        if (!user) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "invalid user" });

        const leagues = await getAllYahooLeagues(user, "league_key");

        res.status(HttpSuccess.OK).json(leagues);
    }
    catch (e) {
        next(e);
    }
}
//HELPER FUNCTION FOR YAHOO ROUTES
async function api(method: "GET" | "POST", url: string, token: YahooTokens, user_id?: string, postData?: any) {
    const response = await fetch(`${YAHOO_API_URL}${url}`, {
        method: method,
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
        body: method === "POST" ? new URLSearchParams(postData).toString() : undefined
    });

    const rawXml = await response.text();

    const data = parser.parse(rawXml);
    if (data["yahoo:error"]) {
        if (/token_expired/i.test(data["yahoo:error"]['yahoo:description'])) {
            const newToken = await refreshAccessToken(token.refresh_token);
            if (user_id) await updateTokenForUser(user_id, newToken);
            return api(method, url, newToken, postData);
        } else {
            throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: data["yahoo:error"]['yahoo:description'] || 'unable to refreh access token' });
        }
    }
    if (data.error) {
        throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: data.error.description });
    }
    if (!data.fantasy_content) throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "no fantasy content in response" });

    return data.fantasy_content;
}
//YAHOO TOKENS REQUIRED
export async function getLeagues(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {

        const tokens = req.yahooTokens;

        const nba_games_endpoint = "/users;use_login=1/games;game_keys=nba/leagues";

        const data = await api("GET", nba_games_endpoint, tokens!);

        if (!data || Object.keys(data).length == 0) {
            res.status(HttpSuccess.OK).json({ games: {} });
        }
        const users_leagues = data.users.user.games.game.leagues.league;

        res.json({ leagues: Array.isArray(users_leagues) ? users_leagues : [users_leagues] });
    }
    catch (e) {
        next(e);
    }
}
const getTeamsInLeagueParams = z.object({
    league_key: z.string()
});

type YahooTeamInfo = {
    team_key: string;
    name: string;
    team_id: number;
    team_logo: {
        team_logo: {
            size: string;
            url: string;
        };
    };
};
async function getTeams(league_key: string, tokens: YahooTokens) {
    const endpoint = `/league/${league_key}/teams`;

    const data = await api("GET", endpoint, tokens);

    if (!data.league) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "League not found" });

    const teams: YahooTeamInfo[] = data.league.teams.team;

    return teams;
}
export async function getTeamsInLeague(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {
        const { league_key } = getTeamsInLeagueParams.parse(req.params);


        const tokens = req.yahooTokens!;
        const teams = await getTeams(league_key, tokens);


        res.status(HttpSuccess.OK).json({ teams: Array.isArray(teams) ? teams : [teams] });
    }
    catch (e) {
        next(e);
    }
}
async function getTeamWithRoster(team_key: string, tokens: YahooTokens) {
    const endpoint = `/team/${team_key}/roster`;
    const data = await api("GET", endpoint, tokens);
    if (!data.team) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "League not found" });
    const team_with_players = data.team;

    return team_with_players;
}
export async function getLeagueRoster(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {
        const { league_key } = getTeamsInLeagueParams.parse(req.params);


        const tokens = req.yahooTokens;

        const teams = await getTeams(league_key, tokens!);

        const teams_with_roster = await Promise.all(teams.map(async (team) => {
            getTeamWithRoster(team.team_key, tokens!);
        }));

        res.status(HttpSuccess.OK).json({ teams: teams_with_roster });
    }
    catch (e) {
        next(e);
    }
}
const getRosterParams = z.object({
    team_key: z.string()
});
export async function getRoster(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {
        const { team_key } = getRosterParams.parse(req.params);

        const tokens = req.yahooTokens;
        const roster = await getTeamWithRoster(team_key, tokens!);

        res.status(HttpSuccess.OK).json({ team: roster });
    }
    catch (e) {
        next(e);
    }
}
export async function getLeagueAndTeams(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {
        const { league_key } = getTeamsInLeagueParams.parse(req.params);

        const endpoint = `/league/${league_key}?out=teams,standings`;

        const tokens = req.yahooTokens;

        const data = await api("GET", endpoint, tokens!, req.user?.user_id);
        const league = data.league;
        res.status(HttpSuccess.OK).json(league);
    }
    catch (e) {
        next(e);
    }
}
/**
 * Will get the 25 most recent transactinos by default
 */
const GetTransactionQueryParams = z.object({
    page: z.coerce.number().min(1)
});
export async function getTransactions(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {
        const { league_key } = YahooLeagueParams.parse(req.params);
        const { page } = GetTransactionQueryParams.parse(req.query);
        //yahoo count starts at 1
        const endpoint = `/league/${league_key}/transactions;count=${page * 25}`;


        const tokens = req.yahooTokens;

        const data = await api("GET", endpoint, tokens!, req.user?.user_id);
        if (!data.league.transactions.transaction || data.league.transactions.transaction.length === 0) {
            res.status(HttpSuccess.OK).json({ transactions: [], count: 0, current_offset: 0 });
        }
        else {
            const mappedTransactions = mapTransactions(data.league.transactions.transaction);
            if (mappedTransactions.length < page * 25) {
                res.status(HttpSuccess.OK).json({ transactions: mappedTransactions.slice((page - 1) * 25), hasMore: false });

            }
            else {
                res.status(HttpSuccess.OK).json({ transactions: mappedTransactions.slice((page - 1) * 25, page * 25), hasMore: true });
            }
        }
    }
    catch (e) {
        next(e);
    }
}

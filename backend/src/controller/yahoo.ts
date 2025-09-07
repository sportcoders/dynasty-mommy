import { NextFunction, Request as ExpressRequest, Response } from "express";
import { XMLParser } from "fast-xml-parser";
import config from "../config/config";
import z from "zod";
import { HttpError, HttpSuccess } from "../constants/constants";
import { AppError } from "../errors/app_error";
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../app";
import { YahooToken } from "../models/yahoo_tokens";

const YAHOO_REDIRECT_URI = "https://dynasty-mommy.onrender.com/yahoo/callback";
const STATE_SECRET = "yahoo_state_sign_secret";
const parser = new XMLParser();

const default_yahoo_values = {
    client_id: config.CONSUMER_KEY,
    client_secret: config.CONSUMER_SECRET,
    redirect_uri: YAHOO_REDIRECT_URI,
};
const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`, 'binary').toString(`base64`);


type YahooTokens = {
    refresh_token: string;
    access_token: string;
    access_token_expiry?: Date;
};
async function token_from_code(code: string): Promise<YahooTokens> {
    const body = {
        ...default_yahoo_values,
        code: code,
        grant_type: "authorization_code",
    };
    const AUTH_HEADER = Buffer.from(`${config.CONSUMER_KEY}:${config.CONSUMER_SECRET}`, 'binary').toString(`base64`);
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
async function refreshAccessToken(refresh_token: string): Promise<YahooTokens> {
    const body = {
        ...default_yahoo_values,
        refresh_token: refresh_token,
        grant_type: "refresh_token",
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

async function getTokenForUser(user_id?: string): Promise<YahooTokens> {
    if (!user_id) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "user cookie missing" });

    const tokens = await AppDataSource.getRepository(YahooToken).findOneBy({ userId: user_id });
    if (!tokens) throw new AppError({ statusCode: HttpError.FORBIDDEN, message: "Yahoo Auth not completed" });

    //checking if access token is expired
    if (tokens.access_token_expiry < new Date(Date.now())) {
        const refreshed_token = await refreshAccessToken(tokens.refresh_token);
        updateTokenForUser(user_id, refreshed_token);
        return refreshed_token;
    }
    return tokens;
}

async function updateTokenForUser(user_id: string, tokens: YahooTokens) {
    await AppDataSource.getRepository(YahooToken).upsert({ ...tokens, access_token_expiry: new Date(Date.now() + (3600 * 1000)), userId: user_id }, ['userId']);
}

async function api(method: "GET" | "POST", url: string, postData: any, token: YahooTokens) {

    const response = await fetch(url, {
        method: method,
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
        body: method === "POST" ? new URLSearchParams(postData).toString() : undefined
    });

    const rawXml = await response.text();

    const data = parser.parse(rawXml);

    if (data.error) {
        if (/token_expired/i.test(data.error.description)) {
            const newToken = await refreshAccessToken(token.refresh_token);
            return api(method, url, postData, newToken);
        } else {
            throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: data.error.description || 'unable to refreh access token' });
        }
    }
    return data;

}
const params_from_yahoo_redirect = z.object({
    code: z.string(),
    state: z.string()
});
export async function request_oauth(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user?.user_id;

        const state = jwt.sign({
            user_id: user
        },
            STATE_SECRET,
            { expiresIn: '5m' });

        const params = new URLSearchParams({
            client_id: config.CONSUMER_KEY,
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
export async function yahoo_callback(req: ExpressRequest, res: Response, next: NextFunction) {
    const { code, state } = params_from_yahoo_redirect.parse(req.query);

    const user = jwt.verify(state, STATE_SECRET) as { user_id: string; };
    const user_id = user.user_id;

    const tokens = await token_from_code(code);
    await updateTokenForUser(user_id, tokens);

    res.redirect("http://localhost:5173/?platform=yahoo&loggedIn=true");
}

export async function get_games(req: ExpressRequest, res: Response, next: NextFunction) {
    const user = req.user?.user_id;

    const tokens = await getTokenForUser(user);

    const nba_games_endpoint = "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams";

    const data = await api("GET", nba_games_endpoint, undefined, tokens);

    res.json({ games: data });
}
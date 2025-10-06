import { NextFunction } from "express";
import { AppDataSource } from "../app";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { YahooToken } from "../models/yahoo_tokens";
import { YahooTokenRequest, YahooTokens } from "../types/yahoo";
import { encrypt, decrypt } from "../utils/symmetric_encryption";
import { yahooConfig } from "../config/yahooConfig";
import { Response } from "express";

const AUTH_HEADER = yahooConfig.authHeader;
const default_yahoo_values = yahooConfig.defaultValues;
export async function refreshAccessToken(refresh_token: string): Promise<YahooTokens> {
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
        throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Failed Yahoo Refresh" });
    }
    return response.json();
}
export async function updateTokenForUser(user_id: string, tokens: YahooTokens) {
    const tokenToEncrypt = { ...tokens, access_token_expiry: new Date(Date.now() + (3600 * 1000)), userId: user_id };
    tokenToEncrypt.access_token = encrypt(tokens.access_token);
    tokenToEncrypt.refresh_token = encrypt(tokens.refresh_token);
    await AppDataSource.getRepository(YahooToken).upsert(tokenToEncrypt, ['userId']);
}
async function getTokenForUser(user_id?: string): Promise<YahooTokens> {
    if (!user_id) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "user cookie missing" });

    const tokens = await AppDataSource.getRepository(YahooToken).findOneBy({ userId: user_id });
    if (!tokens) throw new AppError({ statusCode: HttpError.FORBIDDEN, message: "Yahoo Auth not completed" });
    tokens.access_token = decrypt(tokens.access_token);
    tokens.refresh_token = decrypt(tokens.refresh_token);
    //checking if access token is expired
    if (tokens.access_token_expiry < new Date(Date.now())) {
        const refreshed_token = await refreshAccessToken(tokens.refresh_token);
        await updateTokenForUser(user_id, refreshed_token);
        return refreshed_token;
    }
    return tokens;
}

export async function yahooTokenCheck(req: YahooTokenRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user?.user_id;
        const tokens = await getTokenForUser(user);
        req.yahooTokens = tokens;
        next();
    }
    catch (e) {
        next(e);
    }
}

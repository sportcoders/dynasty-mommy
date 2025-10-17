import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../app";
import { EspnCookies } from "../models/espn_cookies";
import { AppError } from "../errors/app_error";
import { HttpError } from "../constants/constants";

export interface EspnRequest extends Request {
    espnCookies?: EspnCookies;
}

/**
 * Middleware to require ESPN sync
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns A JSON response with a boolean or if the user is synced 
 */
export const espn_authenticate = async (req: EspnRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.user_id;
    const repo = AppDataSource.getRepository(EspnCookies);
    const cookies = await repo.findOneBy({ userId });

    if (!cookies) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "ESPN account is not synced" });

    req.espnCookies = cookies;

    next();
};

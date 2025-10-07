import { NextFunction, Request as ExpressRequest, Response } from "express";

import { AppDataSource } from "../app";
import { EspnCookies } from "../models/espn_cookies";

import { HttpError, HttpSuccess } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { EspnLeague } from "../models/espn_league";

// async function api(method: "GET" | "POST", url: string, cookies: EspnCookies, user_id?: string, postData?: any) {
//     const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         "Cookie": `espn_s2=${cookies.espn_s2}; SWID=${cookies.swid}`,
//     };

//     const response = await fetch(url, {
//         method,
//         headers,
//         body: method === "POST" && postData ? JSON.stringify(postData) : undefined,
//     });

//     if (!response.ok) {
//         throw new AppError({ statusCode: HttpError.BAD_REQUEST, message: "ESPN API request failed" });
//     }

//     return response.json();
// }

/**
 * Saves or updates a user's ESPN authentication cookies in the database.
 *
 * @remarks
 * This function ensures that each user has only one cookie record.
 * - If no record exists for the given userId, a new one is created.
 * - If a record already exists, it is updated with the latest values.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 *
 * @returns A JSON response with a success message when cookies are saved
 */
export async function saveESPNCookies(req: ExpressRequest, res: Response) {
    const userId = req.user!.user_id;
    const { swid, espn_s2 } = req.body;

    const repo = AppDataSource.getRepository(EspnCookies);

    let cookies = await repo.findOneBy({ userId });
    const lastUpdated = new Date(Date.now());

    if (!cookies) {
        cookies = repo.create({ userId, swid, espn_s2, lastUpdated });
    } else {
        cookies.swid = swid;
        cookies.espn_s2 = espn_s2;
        cookies.lastUpdated = new Date(Date.now());
    }

    await repo.save(cookies);

    res.status(HttpSuccess.OK).json({ message: "ESPN account linked sucessfully." });
}

/**
 * Checks the user's synced ESPN account status.
 *
 * @param req - Express request object
 * @param res - Express response object
 *
 * @returns A JSON response with a boolean or if the user is synced 
 */
export async function getESPNStatus(req: ExpressRequest, res: Response) {
    const userId = req.user!.user_id;

    const repo = AppDataSource.getRepository(EspnCookies);
    let cookies = await repo.findOneBy({ userId });

    res.status(HttpSuccess.OK).json({
        isSynced: !!cookies,
    });
}

export async function saveESPNLeague(req: ExpressRequest, res: Response) {
    const userId = req.user!.user_id;

    const { league_id } = req.body;

    const repo = AppDataSource.getRepository(EspnCookies);

    // This checks if the user has synced any ESPN account
    let cookies = await repo.findOneBy({ userId });

    if (!cookies) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Unauthorized" });

    const leagueRepo = AppDataSource.getRepository(EspnLeague);

    // Does not check if the league id is associated with the synced ESPN account
    await leagueRepo.save({ userId: userId, leagueId: league_id });

    res.status(HttpSuccess.OK).send({ message: "ESPN League saved successfully" });
}



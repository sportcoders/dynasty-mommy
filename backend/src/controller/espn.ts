import { NextFunction, Request as ExpressRequest, Response } from "express";

import { AppDataSource } from "../app";
import { EspnCookies } from "../models/espn_cookies";

import { HttpSuccess } from "../constants/constants";

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
export async function saveEspnCookies(req: ExpressRequest, res: Response) {
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


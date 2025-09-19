import { NextFunction, Request as ExpressRequest, Response } from "express";

import { AppDataSource } from "../app";
import { EspnCookies } from "../models/espn_cookies";

import { HttpError, HttpSuccess } from "../constants/constants";
import { AppError } from "../errors/app_error";

export async function saveEspnCookies(req: ExpressRequest, res: Response, next: NextFunction) {
    try {
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

        res.status(HttpSuccess.OK).json({ message: "ESPN cookies saved successfully." });
    } catch (e) {
        next(e);
    }
}


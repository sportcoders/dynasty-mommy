//EXPRESS IMPORTS
import { NextFunction, Request, Response } from "express";
//DATABSE CONNECTION
import { AppDataSource } from "../app";
//DATABASE MODELS
import { User } from "../models/user";
import { SleeperLeague } from "../models/sleeper_league";
//STATUS CODES
import { HttpSuccess, HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import * as z from "zod/v4";


/**
 * Function to get all sleeper leagues for a specific user, it is meant to be called by another function.
 * The function calling is expected get and ensure that the user_id is a valid user_id
 * @param user_id dynasty mommy user_id of user we would like to fetch all sleeper leagues for
 * @returns the sleeper leagues belonging to the user
 */
export async function getAllSleeperLeaguesUser(user_id: string) {
    const sleeperLeagues = await AppDataSource.getRepository(SleeperLeague).createQueryBuilder("league")
        .select([
            "league.league_id AS league_id",
            "league.saved_user AS saved_user",
            "'sleeper' AS platform"
        ])
        .where("league.userId = :user_id", { user_id })
        .getRawMany();
    return sleeperLeagues;
}
/**
 * function to check that the user_id from the jwt is valid
 * @param user_id dynasty_mommy user_id
 * @returns user_id if user is a valid user
 */
async function checkUserId(user_id?: string) {
    if (!user_id) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "missing token" });

    const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: user_id });

    if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });

    return user_id;
}
/**
 * schema for adding a sleeper league
 * @param leauge_id is the sleeper league_id
 * @param user_id is dynasty mommy user_id
 */
export const addLeagueSleeperSchema = z.object({
    league: z.object({
        league_id: z.string(),
        user_id: z.string().optional(),
    })
});

export async function addLeague(req: Request, res: Response, next: NextFunction) {
    try {
        const { league } = await addLeagueSleeperSchema.parseAsync(req.body);

        const user_id = await checkUserId(req.user?.user_id);

        await AppDataSource.getRepository(SleeperLeague).upsert({ userId: user_id, league_id: league.league_id, saved_user: league.user_id }, ['userId', 'league_id']);

        res.status(HttpSuccess.OK).json({
            detail: "League added successfully"
        });
    }
    catch (err) {
        next(err);
    }
}
/**
 * @param leauge_id is sleeper league_id
 */
const deleteSleeperLeagueSchema = z.object({
    league_id: z.string()
});

export async function deleteLeague(req: Request, res: Response, next: NextFunction) {
    try {
        const { league_id } = deleteSleeperLeagueSchema.parse(req.params);

        const user_id = await checkUserId(req.user?.user_id);

        const result = await AppDataSource.getRepository(SleeperLeague).delete({ userId: user_id, league_id: league_id });

        if (result.affected && result.affected > 0)
            res.status(HttpSuccess.OK).json({ detail: "League removed successfully" });
        else
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "League not found" });
    }
    catch (e) {
        next(e);
    }
}

/**
 * @param leauge_id is sleeper league_id
 */
const getSleeperLeagueSchema = z.object({
    league_id: z.string()
});

export async function getLeague(req: Request, res: Response, next: NextFunction) {
    try {
        const { league_id } = getSleeperLeagueSchema.parse(req.params);

        const user_id = await checkUserId(req.user?.user_id);

        const savedLeagueInfo = await AppDataSource.getRepository(SleeperLeague).createQueryBuilder("league")
            .select([
                "league.league_id AS league_id",
                "league.saved_user AS saved_user",
                "'sleeper' AS platform"
            ])
            .where("league.league_id = :league_id", { league_id })
            .getRawOne();

        if (!savedLeagueInfo)
            res.status(HttpSuccess.NO_CONTENT).send();
        else
            res.status(HttpSuccess.OK).json(savedLeagueInfo);

    }
    catch (e) {
        next(e);
    }
}

export async function getAllLeagues(req: Request, res: Response, next: NextFunction) {
    try {

        const user_id = await checkUserId(req.user?.user_id);

        const leagues = await getAllSleeperLeaguesUser(user_id);

        res.status(HttpSuccess.OK).json({ leagues: leagues });
    }
    catch (e) {
        next(e);
    }
}
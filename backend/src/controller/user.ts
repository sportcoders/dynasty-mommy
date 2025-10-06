import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { HttpSuccess, HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { AppDataSource } from "../app";
import { changeUsernameSchema } from "../schemas/user";
import { checkUserId } from "../utils/checkUserId";
import { getAllSleeperLeaguesUser } from "./sleeper_league";
import { getAllYahooLeagues } from "./yahoo";
import { user_not_found_error } from "../errors/user_not_found_error";

export async function getUserLeagues(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = await checkUserId(req.user?.user_id);
        const [sleeper_leagues, yahoo_leagues] = await Promise.all([getAllSleeperLeaguesUser(user_id) ?? [], getAllYahooLeagues(user_id, "league_id") ?? []]);

        const result = sleeper_leagues.concat(yahoo_leagues);

        res.status(HttpSuccess.OK).json({ leagues: result });
    }
    catch (e) {
        next(e);
    }
}

export async function changeUsername(req: Request, res: Response, next: NextFunction) {
    try {
        const { new_username } = changeUsernameSchema.parse(req.body);

        const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.user_id });
        if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });
        const usernameCheck = await AppDataSource.getRepository(User).createQueryBuilder("user").where("user.username LIKE LOWER(:username)", { username: new_username }).getOne();

        if (usernameCheck && usernameCheck.id != req.user?.user_id) throw new AppError({ statusCode: HttpError.CONFLICT, message: "Username is already taken" });

        await AppDataSource.getRepository(User).update({ id: req.user!.user_id }, { username: new_username });
        res.status(HttpSuccess.OK).json({ detail: "username updated" });
    }
    catch (e) {
        next(e);
    }
}

export async function getProfileInfo(req: Request, res: Response) {
    const user = await AppDataSource.getRepository(User).findOne({ where: { id: req.user?.user_id }, select: ['email', 'username'] });

    if (!user) throw user_not_found_error;

    res.status(HttpSuccess.OK).json(user);
}

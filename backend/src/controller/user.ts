import { NextFunction, Request, Response } from "express";
import { User, UserLeagues } from "../models/user";
import { HttpSuccess, HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { AppDataSource } from "../app";
import { changeUsernameSchema } from "../schemas/user";



export async function getUserLeagues(req: Request, res: Response, next: NextFunction) {
    try {
        const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.user_id });
        if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });

        const leagues = await AppDataSource.getRepository(UserLeagues).find({
            where: { userId: req.user?.user_id },
            select: ['league_id', 'platform']
        });

        res.status(HttpSuccess.OK).send({ leagues });
    }
    catch (e) {
        next(e);
    }
}

export async function isUserLeague(req: Request, res: Response, next: NextFunction) {
    try {
        const league = req.params;

        if (!req.user || !req.user.email || !req.user.user_id) {
            throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Unauthorized" });
        }

        const user = await AppDataSource.manager.findOneBy(User, { email: req.user.email });
        if (user == null) {
            throw new AppError({
                statusCode: HttpError.NOT_FOUND,
                message: "User not found",
            });
        }

        const check = await AppDataSource.manager.findOneBy(UserLeagues, {
            user: {
                email: req.user.email
            },
            league_id: league.league_id,
            platform: league.platform
        });

        res.status(HttpSuccess.OK).json(check ? true : false);

    } catch (e) {
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


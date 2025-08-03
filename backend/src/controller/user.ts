import { NextFunction, Request, Response } from "express";
import { User, UserLeagues } from "../models/user";
import { HttpSuccess, HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { AppDataSource } from "../app";
import { addUserToLeagueSchema, changeUsernameSchema, deleteUserLeagueSchema, getTeamSchema, saveTeamSleeperSchema } from "../schemas/user";

export async function addLeagueToUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { league } = await addUserToLeagueSchema.parseAsync(req.body);

        if (!req.user || !req.user.email || !req.user.user_id) {
            return res.status(HttpError.UNAUTHORIZED).json({ message: "Unauthorized" });
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

        if (check !== null) {
            throw new AppError({
                statusCode: HttpError.CONFLICT,
                message: "League alrady exists for user",
            });
        }
        await AppDataSource.manager.save(UserLeagues, {
            userId: user.id,
            platform: league.platform,
            user: user,
            league_id: league.league_id
        });
        return res.status(HttpSuccess.OK).json({
            message: "League added successfully"
        });
    }
    catch (err) {
        next(err);
    }
}

export async function getUserLeagues(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user || !req.user.email || !req.user.user_id) {
            return res.status(HttpError.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const user = await AppDataSource.manager.findOneBy(User, { email: req.user.email });
        if (user == null) {
            throw new AppError({
                statusCode: HttpError.NOT_FOUND,
                message: "User not found",
            });
        }

        const leagues = await AppDataSource.getRepository(UserLeagues).find({
            where: { user },
            select: ['league_id', 'platform']
        });

        return res.status(200).send({ leagues });
    }
    catch (e) {
        next(e);
    }
}
export async function deleteUserLeagues(req: Request, res: Response, next: NextFunction) {
    try {
        const { league_id, platform } = deleteUserLeagueSchema.parse(req.params);

        if (!req.user) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Unauthorized" });

        const result = await AppDataSource.getRepository(UserLeagues).delete({ userId: req.user.user_id, league_id: league_id, platform: platform });

        if (result.affected && result.affected > 0) return res.status(HttpSuccess.OK).json({ detail: "League removed successfully" });

        throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "League not found" });
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

export async function saveTeam(req: Request, res: Response, next: NextFunction) {
    try {
        const { league_id, user_id } = saveTeamSleeperSchema.parse(req.body);

        const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.user_id });

        if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });

        await AppDataSource.getRepository(UserLeagues).upsert({ userId: req.user?.user_id, league_id: league_id, saved_user: user_id, platform: "sleeper" }, ['userId', 'league_id']);

        res.status(HttpSuccess.OK).json({ detail: "team saved" });
    }
    catch (e) {
        next(e);
    }
}
export async function getSavedTeams(req: Request, res: Response, next: NextFunction) {
    try {
        const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.user_id });

        if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });

        const response = await AppDataSource.getRepository(UserLeagues).find({
            where: { userId: req.user?.user_id },
            select: ['league_id', 'platform', 'saved_user']
        });
        res.status(HttpSuccess.OK).json(response);
    }
    catch (e) {
        next(e);
    }
}

export async function getSavedTeamSleeper(req: Request, res: Response, next: NextFunction) {
    try {
        const { league_id } = getTeamSchema.parse(req.params);
        const userCheck = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.user_id });
        if (!userCheck) throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "user not found" });

        const response = await AppDataSource.getRepository(UserLeagues).findOne({
            where: {
                userId: req.user?.user_id,
                league_id: league_id
            },
            select: ['league_id', 'platform', 'saved_user']
        });
        res.status(HttpSuccess.OK).json(response);
    }
    catch (e) {
        next(e);
    }
}
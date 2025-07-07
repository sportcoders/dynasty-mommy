import { NextFunction, Request, Response } from "express"
import { User, UserLeagues } from "../models/user"
import { HttpSuccess, HttpError } from "../constants/constants"
import { AppError } from "../errors/app_error"
import { AppDataSource } from "../app"
import { addUserToLeagueSchema } from "../schemas/user"

export async function addLeagueToUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { league } = await addUserToLeagueSchema.parseAsync(req.body)

        if (!req.user || !req.user.email || !req.user.user_id) {
            return res.status(HttpError.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const user = await AppDataSource.manager.findOneBy(User, { email: req.user.email })
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
            league_id: league.id,
            platform: league.platform
        })

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
            league_id: league.id
        })
        return res.status(HttpSuccess.OK).json({
            message: "League added successfully"
        });
    }
    catch (err) {
        next(err)
    }
}

export async function getUserLeagues(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user || !req.user.email || !req.user.user_id) {
            return res.status(HttpError.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const user = await AppDataSource.manager.findOneBy(User, { email: req.user.email })
        if (user == null) {
            throw new AppError({
                statusCode: HttpError.NOT_FOUND,
                message: "User not found",
            });
        }

        const leagues = await AppDataSource.getRepository(UserLeagues).find({
            where: { user },
            select: ['league_id', 'platform']
        })
        return res.status(200).send({ leagues })
    }
    catch (e) {
        next(e)
    }
}
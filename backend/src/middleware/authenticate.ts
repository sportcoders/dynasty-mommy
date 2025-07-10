import { NextFunction, Request, Response } from "express";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { verifyToken } from "../utils/jwt";
import UserSession from "../models/session";

declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id?: string;
                email: string;
                username?: string;
            }
        }
    }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Invalid access token" })

        const { error, payload } = verifyToken(accessToken);

        if (error || !payload || payload.type == 'refresh') throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: error === "jwt expired" ? "Token expired" : "Invalid token" });

        // const validSession = await UserSession.findById(payload.id)
        // //check date of session
        // if (!validSession || validSession.expiresAt < new Date()) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "missing/expired session" });

        req.user = { email: payload.email, user_id: payload.id, username: payload.username }

        next();

    }
    catch (err) {
        next(err)
    }

}
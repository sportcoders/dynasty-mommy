import { NextFunction, Request, Response } from "express";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { verifyToken } from "../utils/jwt";
import { User } from "../types/user";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace('Bearer ', '')

        if (!token) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Invalid access token" });

        const { error, payload } = verifyToken(token);

        if (!payload) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: error === "jwt expired" ? "Token expired" : "Invalid token" });

        if (typeof payload !== 'string') {
            // const id = payload.id;
            req.user = { email: payload.id, user_id: "test", username: "test" }
        }
        console.log(payload)

        // req.userId = payload.userId;
        // req.sessionId = payload.sessionId;
        next();

    }
    catch (err) {
        next(err)
    }

}
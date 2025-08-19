import { NextFunction, Request, Response } from "express";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { verifyToken } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id: string;
                email: string;
            };
        }
    }
}
/**
 * MIDDLEWARE
 * used to get user_id and email from the cookie and place
 * will place user_id and email and extend express request fields
 * @param 
 * @param res 
 * @param next 
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Invalid access token" });

        const { error, payload } = verifyToken(accessToken);

        if (error || !payload || payload.type == 'refresh') throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: error === "jwt expired" ? "Token expired" : "Invalid token" });

        req.user = { email: payload.email, user_id: payload.id };

        next();

    }
    catch (err) {
        next(err);
    }

};
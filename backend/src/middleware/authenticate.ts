import { NextFunction, Request, Response } from "express";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { verifyToken } from "../utils/jwt";

// declare module 'express-serve-static-core' {
//     interface Request {
//         user?: {
//             user_id?: string,
//             email: string,
//             username: string
//         }
//     }
// }
declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id?: string;
                email: string;
                username: string;
            }
        }
    }
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace('Bearer ', '')

        if (!token) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Invalid access token" });

        const { error, payload } = verifyToken(token);

        if (error || !payload) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: error === "jwt expired" ? "Token expired" : "Invalid token" });

        req.user = { email: payload.id, user_id: "test", username: "test" }

        console.log(payload)

        next();

    }
    catch (err) {
        next(err)
    }

}
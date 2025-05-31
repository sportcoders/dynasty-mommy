import { NextFunction, Request, Response } from "express";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

export interface CustomRequest extends Request {
    token: string | JwtPayload
}
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace('Bearer ', '')

    if (!token) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: "Invalid access token" });

    const { error, payload } = verifyToken(token);

    if (!payload) throw new AppError({ statusCode: HttpError.UNAUTHORIZED, message: error === "jwt expired" ? "Token expired" : "Invalid token" });


    (req as CustomRequest).token = payload;
    console.log(payload)

    // req.userId = payload.userId;
    // req.sessionId = payload.sessionId;

    next();
}
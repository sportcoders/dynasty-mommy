import { NextFunction, Request, Response } from "express";
import { MongooseError } from "mongoose";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { logger } from "./logger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error(err.message)
    if (err instanceof MongooseError) {
        res.status(HttpError.INTERNAL_SERVER_ERROR)
    }
    else if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message })
    }
    else {
        res.status(HttpError.INTERNAL_SERVER_ERROR).json({ errorType: typeof err, message: err.message })
    }
}
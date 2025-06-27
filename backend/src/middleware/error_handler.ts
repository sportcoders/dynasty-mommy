import { NextFunction, Request, Response } from "express";
import { MongooseError } from "mongoose";
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import { logger } from "./logger";
import * as z from 'zod/v4'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error(err.message)
    if (err instanceof MongooseError) {
        res.status(HttpError.INTERNAL_SERVER_ERROR)
    }
    else if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message })
    }
    else if (err instanceof z.ZodError) {
        res.status(HttpError.UNPROCESSABLE_ENTITY).json({
            detail: "validation error",
            issues: err.issues
        })
    }
    else {
        res.status(HttpError.INTERNAL_SERVER_ERROR).json({ errorType: typeof err, message: err.message })
    }
}
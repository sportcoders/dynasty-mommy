import { Request, Response, NextFunction } from "express";
import { HttpError } from "../constants/constants";
import { AppError } from "./app_error";
export function invalid_endpoint(req: Request, res: Response, next: NextFunction) {
    throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "not found" })
}
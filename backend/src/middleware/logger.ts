import { Request, Response, NextFunction } from "express";
import winston from 'winston'
const { combine, timestamp, errors, json, cli } = winston.format
export const logger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), errors({ stack: true }), cli()),
    // format: winston.format.cli(), //switch to json()
    transports: [new winston.transports.Console(),
    new winston.transports.File({ filename: "standard.log" })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: "exception.log" })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: "rejections.log" })
    ]
})
export function req_info(req: Request, res: Response, next: NextFunction) {
    logger.info(`${req.method} ${req.path}`)
    // winston.log("info", `${req.method} ${req.path}`)
    // console.log(`${req.method} ${req.path}`);
    next()
}
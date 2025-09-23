import { HttpError, HttpSuccess } from "../constants/constants";
import { AppError } from "../errors/app_error";
import Player_Sleeper from "../models/player_sleeper";
import { NextFunction, Request, Response } from 'express';
import {
    MongoNetworkError,
    MongoServerSelectionError,
    MongoNetworkTimeoutError
} from 'mongodb';
/**
 * 
 * @param ids array of ids from the url
 * @returns the list of validated ids
 * @throws validation error if the id format does not match(4 digit id format)
 */
const verifyIDs = (ids: string[]) => {
    const valid = ids.filter(id => /^\d{4}$/.test(id));
    if (valid.length !== ids.length)
        throw new AppError({ statusCode: HttpError.UNPROCESSABLE_ENTITY, message: "Invalid ID Format" });
    return valid;
};
/**
 * 
 * @param player_id - string of player_id(s). if multiple, each player_id is seperated
 *                    by a "&". ex. 1234&2234 is a request to get player_id 1234 and 2234
 * @returns object in format
 *          {
 *              players: array of player objects in the order they were request in
 *              THE FOLLOWING ARE ALSO RETURNED IF THERE ARE MISSING PLAYERS
 *              missing_values: boolean
 *              missing_ids: array of missing ids
 *          }
 * @error returns status code of 404 if no players from the request are found
 */
export const getPlayersById = async function (req: Request, res: Response, next: NextFunction) {
    const ids = req.params.player_id;
    if (!ids) {
        throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "No Ids Provided" });
    }
    try {
        const player_ids = verifyIDs(ids.split("&"));
        const players = await retryDB(() => Player_Sleeper.find({ id: { $in: player_ids } }).lean());
        if (players.length == 0) {
            throw new AppError({ statusCode: HttpError.NOT_FOUND, message: "No Players found" });
            //log that ids were in valid format but does not exist in database
        }
        const foundIds = players.map(p => p.id);
        const missing_ids = player_ids.filter(id => !foundIds.includes(id));
        if (missing_ids.length > 0) {
            res.status(HttpSuccess.PARTIAL_CONTENT).json({
                missing_values: true,
                players: players,
                missing_ids: missing_ids
            });
        }
        else {
            res.status(HttpSuccess.OK).json({
                missing_values: false,
                players: players
            });
        }
    }
    catch (e) {
        next(e);
    }
};

async function retryDB<T>(operation: () => Promise<T>, retries = 3, delay = 100) {
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        }
        catch (e) {
            if (i < retries && (e instanceof MongoNetworkError || e instanceof MongoServerSelectionError || e instanceof MongoNetworkTimeoutError))
                await new Promise(res => setTimeout(res, delay));
            else
                throw e;
        }
    }
    throw new AppError({ statusCode: HttpError.INTERNAL_SERVER_ERROR, message: "Could not query mongodb" });
}
import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import Player_Sleeper from "../models/player_sleeper"
import { NextFunction, Request, Response } from 'express';

const verifyIDs = (ids: string[]) => {
    const valid = ids.filter(id => /^\d{4}$/.test(id))
    if (valid.length !== ids.length)
        throw new AppError({ statusCode: HttpError.UNPROCESSABLE_ENTITY, message: "Invalid ID Format" })
    return valid
}
export const getPlayersById = async function (req: Request, res: Response, next: NextFunction) {
    const ids = req.params.player_id
    if (!ids) {
        return res.status(404).send({ message: "No Ids Provided" })
    }
    try {
        const player_ids = verifyIDs(ids.split("&"))
        const players = await Player_Sleeper.find({ id: { $in: player_ids } }).lean()
        if (players.length == 0) {
            return res.status(404).json({ detail: "No players found" })
            //log that ids were in valid format but does not exist in database
        }
        const foundIds = players.map(p => p.id);
        const missing_ids = player_ids.filter(id => !foundIds.includes(id));
        if (missing_ids.length > 0) {
            return res.status(206).json({
                missing_values: true,
                players: players,
                missing_ids: missing_ids
            })
        }
        res.status(200).json({ missing_values: false, players: players })
    }
    catch (e) {
        next(e)
    }
}
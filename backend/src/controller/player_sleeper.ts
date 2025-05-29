import { HttpError } from "../constants/constants";
import { AppError } from "../errors/app_error";
import Player_Sleeper from "../models/player_sleeper"
import { NextFunction, Request, Response } from 'express';

const verifyID = (p_id: string) => {
    if (p_id.match(/^\d{4}$/))
        return Player_Sleeper.find({ id: p_id })
    throw new AppError({ statusCode: HttpError.UNPROCESSABLE_ENTITY, message: "Invalid ID Format" })
}
export const getPlayersById = async function (req: Request, res: Response, next: NextFunction) {
    const ids = req.params.player_id
    if (!ids) {
        return res.status(404).send({ message: "No Ids Provided" })
    }
    try {
        const player_ids = ids.split("&");
        const promises = player_ids.map(p_id => verifyID(p_id));
        const players = await Promise.all(promises);
        const missing_ids: string[] = [];
        if (players[0].length) {
            //log that ids were in valid format but does not exist in database
        }
        players.forEach((res, index) => {
            if (res.length === 0) {
                missing_ids.push(player_ids[index]);
            }
        });
        if (missing_ids.length > 0) {
            return res.status(206).json({
                missing_values: true,
                players,
                missing_ids: missing_ids
            })
        }
        res.status(200).json({ missing_values: false, players })
    }
    catch (e) {
        next(e)
    }
}
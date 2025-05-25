import Player_Sleeper from "../models/player_sleeper"
import { Request, Response } from 'express';


export const getPlayerById = async function (req: Request, res: Response) {
    const player_id = req.query.player_id
    if (!player_id) {
        return res.status(404).send({ message: "Player Id missing from request" })
    }
    try {
        const player = await Player_Sleeper.find({ id: player_id })

        if (player && player.length > 0) {
            res.status(200).send(player);
        } else {
            res.status(404).send({ message: "Player not found" });
        }
    }
    catch (e) {
        res.status(500).send({ message: "Internal Server Error" })
    }
}
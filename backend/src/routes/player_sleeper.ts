import { Router } from "express";
import { getPlayersById } from '../controller/player_sleeper'
const player_sleeper_router = Router()



//GET: Get player by sleeper id, can get multiple players by seperating player_id with "&"
player_sleeper_router.route('/:player_id').get((req, res, next) => {
    getPlayersById(req, res, next)
})


export default player_sleeper_router
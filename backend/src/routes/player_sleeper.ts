import { Router } from "express";
import { getPlayerById } from '../controller/player_sleeper'
const player_sleeper_router = Router()

player_sleeper_router.route('/').get((req, res) => {
    getPlayerById(req, res)
})


export default player_sleeper_router
import { Router } from "express";
import * as sleeper_player_controller from '../controller/player_sleeper';
const player_sleeper_router = Router();



//GET: Get player by sleeper id, can get multiple players by seperating player_id with "&"
player_sleeper_router.route('/:player_id').get(sleeper_player_controller.getPlayersById);


export default player_sleeper_router;
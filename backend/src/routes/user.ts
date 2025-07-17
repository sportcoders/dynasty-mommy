import { Router } from "express";
import * as user_controller from "../controller/user"
import { authenticate } from "../middleware/authenticate";
const user_router = Router()

user_router.route("/addLeague").post(authenticate, (req, res, next) => { user_controller.addLeagueToUser(req, res, next) })
user_router.route("/getLeagues").get(authenticate, (req, res, next) => { user_controller.getUserLeagues(req, res, next) })
user_router.route("/removeLeague/:league_id/:platform").delete(authenticate, (req, res, next) => { user_controller.deleteUserLeagues(req, res, next) })

export default user_router
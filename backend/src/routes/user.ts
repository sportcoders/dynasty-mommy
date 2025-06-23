import { Router } from "express";
import * as user_controller from "../controller/user"
import { authenticate } from "../middleware/authenticate";
const user_router = Router()

user_router.route("/login").post((req, res, next) => { user_controller.login(req, res, next) })
user_router.route("/signup").post((req, res, next) => { user_controller.signUp(req, res, next) })
user_router.route("/addLeague").post(authenticate, (req, res, next) => { user_controller.addLeagueToUser(req, res, next) })

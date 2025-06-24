import { Router } from "express";
// import * as user_controller from "../controller/user"
import { authenticate } from "../middleware/authenticate";
import { login, signUp, addLeagueToUser } from "../controller/user";
const user_router = Router()

user_router.route("/login").post((req, res, next) => { login(req, res, next) })
user_router.route("/signup").post((req, res, next) => { signUp(req, res, next) })
user_router.route("/addLeague").post(authenticate, (req, res, next) => { addLeagueToUser(req, res, next) })

export default user_router
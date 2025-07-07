import { Router } from "express";
import * as auth_controller from "../controller/auth"
const auth_router = Router()

auth_router.route("/login").post((req, res, next) => { auth_controller.login(req, res, next) })
auth_router.route("/signup").post((req, res, next) => { auth_controller.signUp(req, res, next) })
auth_router.route("/refresh").get((req, res, next) => { auth_controller.refresh(req, res, next) })
export default auth_router
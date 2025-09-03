import { Router } from "express";
import * as auth_controller from "../controller/auth";
const auth_router = Router();

auth_router.route("/login").post(auth_controller.login);
auth_router.route("/signup").post(auth_controller.signUp);
auth_router.route("/refresh").get(auth_controller.refresh);
auth_router.route("/yahoo/callback").get(auth_controller.yahoo);
export default auth_router;
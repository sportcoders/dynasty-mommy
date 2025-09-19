import { Router } from "express";
import * as user_controller from "../controller/user";
import { authenticate } from "../middleware/authenticate";
const user_router = Router();
user_router.use(authenticate);
user_router.route("/leagues").get(user_controller.getUserLeagues);
user_router.route("/username").patch(user_controller.changeUsername);

export default user_router;
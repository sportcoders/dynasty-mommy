import { Router } from "express";
import * as yahoo_controller from "../controller/yahoo";
import { authenticate } from "../middleware/authenticate";
const yahoo_router = Router();
yahoo_router.route("/callback").get(yahoo_controller.yahoo_callback);
yahoo_router.use(authenticate);
yahoo_router.route("/oauth/start").get(yahoo_controller.request_oauth);
yahoo_router.route("/leagues").get(yahoo_controller.getLeagues);

export default yahoo_router;
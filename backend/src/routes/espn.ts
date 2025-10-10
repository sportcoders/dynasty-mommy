import { Router } from "express";
import * as espn_controller from "../controller/espn";
import { authenticate } from "../middleware/authenticate";
import { espn_authenticate } from "../middleware/espn_authenticate";
const espn_router = Router();
espn_router.use(authenticate);
espn_router.route("/cookies").post(espn_controller.saveESPNCookies);
espn_router.route("/status").get(espn_controller.getESPNStatus);
espn_router.route("/league").post(espn_controller.saveESPNLeague);
espn_router.use(espn_authenticate);
// Any routes that needs user auth and espn auth (need to check if espn auth works for the saved league ids)
// getting user league info
// getting roster/players
// getting transactions
export default espn_router;
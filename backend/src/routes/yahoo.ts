import { Router } from "express";
import * as yahoo_controller from "../controller/yahoo";
import { authenticate } from "../middleware/authenticate";
const yahoo_router = Router();
yahoo_router.route("/callback").get(yahoo_controller.yahoo_callback);
yahoo_router.use(authenticate);
yahoo_router.route("/oauth/start").get(yahoo_controller.request_oauth);
yahoo_router.route("/leagues").get(yahoo_controller.getLeagues);
yahoo_router.route("/leagues/:league_key/teams").get(yahoo_controller.getLeagueAndTeams);
yahoo_router.route("/roster/:team_key").get(yahoo_controller.getRoster);
yahoo_router.route("/unlink").delete(yahoo_controller.unlinkYahoo);

export default yahoo_router;
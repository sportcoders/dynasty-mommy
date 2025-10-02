import { Router } from "express";
import * as yahoo_controller from "../controller/yahoo";
import { authenticate } from "../middleware/authenticate";
import { yahooTokenCheck } from "../middleware/yahooTokenCheck";
const yahoo_router = Router();

yahoo_router.route("/callback").get(yahoo_controller.yahoo_callback);
yahoo_router.use(authenticate);
yahoo_router.route("/oauth/start").get(yahoo_controller.request_oauth);
//UNLINK YAHOO ACCOUNT
yahoo_router.route("/unlink").delete(yahoo_controller.unlinkYahoo);
//ROUTES TO GET YAHOO
yahoo_router.use(yahooTokenCheck);
yahoo_router.route("/leagues").get(yahoo_controller.getLeagues);
yahoo_router.route("/leagues/:league_key/teams").get(yahoo_controller.getLeagueAndTeams);
yahoo_router.route("/roster/:team_key").get(yahoo_controller.getRoster);
yahoo_router.route("/league/:league_key/transactions").get(yahoo_controller.getTransactions);
//DM API ROUTES
yahoo_router.route("/league").post(yahoo_controller.saveLeague);
yahoo_router.route("/league/allSaved").get(yahoo_controller.getAllSavedYahooLeague);
yahoo_router.route("/league/:league_key").delete(yahoo_controller.removeLeague);
yahoo_router.route("/league/:league_key").get(yahoo_controller.getLeague);
export default yahoo_router;
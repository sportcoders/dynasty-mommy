import { Router } from "express";
import * as user_controller from "../controller/user";
import { authenticate } from "../middleware/authenticate";
const user_router = Router();

user_router.route("/addLeague").post(authenticate, user_controller.addLeagueToUser);
user_router.route("/getLeagues").get(authenticate, user_controller.getUserLeagues);
user_router.route("/isUserLeague/:league_id/:platform").get(authenticate, user_controller.isUserLeague);
user_router.route("/removeLeague/:league_id/:platform").delete(authenticate, user_controller.deleteUserLeagues);
user_router.route("/username").patch(authenticate, user_controller.changeUsername);
user_router.route("/saveTeamSleeper").post(authenticate, user_controller.saveTeam);
user_router.route("/savedTeams").get(authenticate, user_controller.getSavedTeams);
user_router.route("/savedTeam/sleeper/:league_id").get(authenticate, user_controller.getSavedTeamSleeper);
export default user_router;
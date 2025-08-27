import { Router } from "express";
import * as controller from "../controller/sleeper_league";
import { authenticate } from "../middleware/authenticate";

const sleeper_league_router = Router();
sleeper_league_router.use(authenticate);
sleeper_league_router.route("/").post(controller.addLeague);
sleeper_league_router.route("/").get(controller.getAllLeagues);
sleeper_league_router.route("/:league_id").get(controller.getLeague);
sleeper_league_router.route("/:league_id").delete(controller.deleteLeague);

export default sleeper_league_router;
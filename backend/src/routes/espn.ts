import { Router } from "express";
import * as espn_controller from "../controller/espn";
import { authenticate } from "../middleware/authenticate";
import { espn_authenticate } from "../middleware/espn_authenticate";

const espn_router = Router();

// -------------------------
// 1. User authentication required
// -------------------------
espn_router.use(authenticate);

// Save/update ESPN cookies
espn_router.route("/cookies").post(espn_controller.saveEspnCookies);

// Check ESPN account sync status
espn_router.route("/status").get(espn_controller.getEspnStatus);

// -------------------------
// 2. ESPN auth required (cookies must exist)
// -------------------------
espn_router.use(espn_authenticate);

// Get all saved ESPN leagues for the user
// espn_router.route("/leagues").get(espn_controller.getSavedEspnLeagues);

// Save a league for the user
espn_router.route("/league").post(espn_controller.saveEspnLeague);

// Get info for a specific league (name, settings, scoring)
espn_router.route("/league/:leagueId/info").get(espn_controller.getEspnLeagueInfo);

// Get teams for a specific league (team name, record, logo)
// espn_router.route("/league/:leagueId/teams").get(espn_controller.getEspnTeams);

// Get full rosters for a league (players with name + main position)
// espn_router.route("/league/:leagueId/rosters").get(espn_controller.getEspnRosters);

// Get transactions for a league (adds, drops, trades; includes full name, timestamp, other details)
// espn_router.route("/league/:leagueId/transactions").get(espn_controller.getEspnTransactions);

export default espn_router;

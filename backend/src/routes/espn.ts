import { Router } from "express";
import * as espn_controller from "../controller/espn";
import { authenticate } from "../middleware/authenticate";
const espn_router = Router();
espn_router.use(authenticate);
espn_router.route("/cookies").post(espn_controller.saveEspnCookies);
export default espn_router;
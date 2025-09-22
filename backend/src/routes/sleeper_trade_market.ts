import { Router } from "express";
const sleeper_trade_market_router = Router();
import * as sleeper_trade_market_controller from '../controller/sleeper_trade_market';
//gets most recent transactions
sleeper_trade_market_router.route('/').get(sleeper_trade_market_controller.getTradeMarket);

export default sleeper_trade_market_router;
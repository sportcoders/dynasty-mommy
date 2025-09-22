import { NextFunction, Request, Response } from "express";
import * as z from "zod/v4";
import Sleeper_Trade_Market from "../models/sleeper_trade_market";
import { HttpSuccess } from "../constants/constants";

const sleeper_trade_market_get = z.object({
    limit: z.coerce.number().default(25),
    searchText: z.string().optional()
});
export async function getTradeMarket(req: Request, res: Response, next: NextFunction) {
    const { limit, searchText } = sleeper_trade_market_get.parse(req.query);
    let query: any = {};

    if (searchText?.trim()) {
        const split = searchText.trim().split(/\s+/);

        if (split.length > 1) {
            query = {
                trades: {
                    $elemMatch: {
                        $elemMatch: {
                            first_name: { $regex: split[0], $options: "i" },
                            last_name: { $regex: split.slice(1).join(" "), $options: "i" }
                        }
                    }
                }
            };
        } else {
            query = {
                trades: {
                    $elemMatch: {
                        $elemMatch: {
                            $or: [
                                { first_name: { $regex: split[0], $options: "i" } },
                                { last_name: { $regex: split[0], $options: "i" } }
                            ]
                        }
                    }
                }

            };
        }
    }
    const data = await Sleeper_Trade_Market.find(query).sort({ status_updated: -1 }).limit(limit);
    res.status(HttpSuccess.OK).json(data);
}
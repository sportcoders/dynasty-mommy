import mongoose from "mongoose";

const sleeper_trade_market = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        status_updated: {
            type: Number
        },
        trades: [[{
            first_name: {
                type: String
            },
            last_name: { type: String },
        }]]
    }, { collection: 'sleeper_trade_market' }
);
const Sleeper_Trade_Market = mongoose.model('Sleeper_Trade_Market', sleeper_trade_market);
export default Sleeper_Trade_Market;
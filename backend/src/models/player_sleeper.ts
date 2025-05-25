import mongoose from "mongoose";

const player_sleeper = new mongoose.Schema(
    {
        id: {
            type: String
        },
        first_name: {
            type: String
        },
        last_name: { type: String },
        team: { type: String },
        weight: { type: String },
        height: { type: String },
        position: { type: String },
        fantasy_positions: { type: [String] },
        number: { type: String },
        birth_date: { type: String }
    }, { collection: 'sleeper' }
)
const Player_Sleeper = mongoose.model('Player_Sleeper', player_sleeper)
export default Player_Sleeper
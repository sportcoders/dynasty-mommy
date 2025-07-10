import mongoose from "mongoose";
const SessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        index: true,
    },
    userEmail: {
        type: String,
    },
    userUsername: {
        type: String
    },
    // userAgent: {
    //     type: String
    // },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
})
const UserSession = mongoose.model("Session", SessionSchema)
export default UserSession
import mongoose from "mongoose";

export const connectToDB = async (uri: string) => {
    await mongoose.connect(uri)
}
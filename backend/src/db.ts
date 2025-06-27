import mongoose from "mongoose";
import { DataSource } from "typeorm";

export const connectToDB = async (uri: string, AppDataSource: DataSource) => {
    await mongoose.connect(uri)
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
}
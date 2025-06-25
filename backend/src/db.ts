import mongoose from "mongoose";
import config from "./config/config";
import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
    type: "postgres",
    url: config.URL
    // host: "localhost",
    // port: 5432,
    // username: "test",
    // password: "test",
    // database: "test",
    // synchronize: true,
    // logging: true,
    // entities: [Post, Category],
    // subscribers: [],
    // migrations: [],
})
export const connectToDB = async (uri: string) => {
    await mongoose.connect(uri)
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })
}
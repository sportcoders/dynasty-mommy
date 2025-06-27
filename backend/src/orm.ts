import { DataSource } from "typeorm";
import { User, UserLeagues } from "./models/user";

export function createAppDataSource(url: string): DataSource {
    return new DataSource({
        type: "postgres",
        url: url,
        // host: "localhost",
        // port: 5432,
        // username: "test",
        // password: "test",
        // database: "test",
        // synchronize: true,
        logging: true,
        entities: [User, UserLeagues],
        // subscribers: [],
        // migrations: [],
    })
}
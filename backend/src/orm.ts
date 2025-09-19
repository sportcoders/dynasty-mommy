import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./models/user";
import { SleeperLeague } from "./models/sleeper_league";
import { YahooToken } from "./models/yahoo_tokens";
import { YahooLeague } from "./models/yahoo_league";
import { EspnCookies } from "./models/espn_cookies";

export function createAppDataSource(url: string): DataSource {
    let options: DataSourceOptions;

    if (url == 'sqlite') {
        options = {
            type: "sqlite",
            database: "test.db",
            synchronize: true,
            dropSchema: true,
            logging: false
        };
    }
    else {
        options = {
            type: 'postgres',
            url: url,
            // host: "localhost",
            // port: 5432,
            // username: "test",
            // password: "test",
            // database: "test",
            // synchronize: true,
            // subscribers: [],
            // migrations: [],
            logging: true
        };
    }
    options = { ...options, entities: [User, SleeperLeague, YahooToken, YahooLeague, EspnCookies] };
    return new DataSource(options);
}
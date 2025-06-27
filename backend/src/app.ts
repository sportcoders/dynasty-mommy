import express from 'express';
import player_sleeper_router from './routes/player_sleeper';
import { logger, req_info } from './middleware/logger';
import { errorHandler } from './middleware/error_handler';
import { invalid_endpoint } from './errors/endpoint_not_found';
import cors from 'cors'
import user_router from './routes/user';
import "reflect-metadata"
import { createAppDataSource } from './orm';
import config from './config/config';
import { DataSource } from 'typeorm';
import { initDatasource } from './db';
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Factory function to create app with optional data source
export const createApp = (dataSource?: DataSource) => {
    const app = express();

    // Use provided data source or create default one
    const AppDataSource = dataSource || createAppDataSource(config.URL);
    app.use(cors(corsOptions));
    app.use(express.json())
    app.use(req_info)
    app.use('/sleeper_player', player_sleeper_router)
    app.use('/auth', user_router)
    app.get('/healthcheck', (req, res) => {
        res.status(200).json({ message: "Healthy" });
    });
    app.use(invalid_endpoint)
    app.use(errorHandler)

    return { app, dataSource: AppDataSource };
};

// Create default app instance for non-test environments
// const { app, dataSource: AppDataSource } = createApp();
// export default app;
// export { AppDataSource };
let AppDataSource: DataSource;
export function init_app(dataSource: DataSource) {
    const app = express();
    AppDataSource = dataSource
    // await initDatasource(AppDataSource)

    // Use provided data source or create default one
    app.use(cors(corsOptions));
    app.use(express.json())
    app.use(req_info)
    app.use('/sleeper_player', player_sleeper_router)
    app.use('/auth', user_router)
    app.get('/healthcheck', (req, res) => {
        res.status(200).json({ message: "Healthy" });
    });
    app.use(invalid_endpoint)
    app.use(errorHandler)

    return app
}
export { AppDataSource }
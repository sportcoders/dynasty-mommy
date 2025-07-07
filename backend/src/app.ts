import express from 'express';
import player_sleeper_router from './routes/player_sleeper';
import { req_info } from './middleware/logger';
import { errorHandler } from './middleware/error_handler';
import { invalid_endpoint } from './errors/endpoint_not_found';
import cors from 'cors'
import user_router from './routes/user';
import "reflect-metadata"
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';
import auth_router from './routes/auth';
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
};

let AppDataSource: DataSource;
export function init_app(dataSource: DataSource) {
    const app = express();
    AppDataSource = dataSource

    app.use(cors(corsOptions));
    app.use(cookieParser())

    app.use(express.json())
    app.use(req_info)
    app.use('/sleeper_player', player_sleeper_router)
    app.use('/auth', auth_router)
    app.use('/user', user_router)
    app.get('/healthcheck', (req, res) => {
        res.status(200).json({ message: "Healthy" });
    });
    app.use(invalid_endpoint)
    app.use(errorHandler)

    return app
}
export { AppDataSource }
import express, { NextFunction, Response, Request } from 'express';
import player_sleeper_router from './routes/player_sleeper';
import { logger, req_info } from './middleware/logger';
import { errorHandler } from './middleware/error_handler';
import { invalid_endpoint } from './errors/endpoint_not_found';
import cors from 'cors'
import user_router from './routes/user';
import "reflect-metadata"
const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(req_info)
app.use('/sleeper_player', player_sleeper_router)
app.use('/auth', user_router)
app.get('/healthcheck', (req, res) => {
    res.status(201).json({ message: "Healthy" });
});
app.use(invalid_endpoint)
app.use(errorHandler)

export default app
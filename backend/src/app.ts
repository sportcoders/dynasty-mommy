import express from 'express';
import player_sleeper_router from './routes/player_sleeper';
import mongoose from 'mongoose';
import config from './config/config';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error_handler';
import { invalid_endpoint } from './errors/endpoint_not_found';
const app = express();

mongoose.connect(config.URI)

app.use(express.json())
app.use(logger)
app.use('/sleeper_player', player_sleeper_router)
app.use(invalid_endpoint)
app.use(errorHandler)
app.get('/healthcheck', (req, res) => {
    res.send("Healthy");
});

export default app
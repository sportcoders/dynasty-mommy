import express from 'express';
import player_sleeper_router from './routes/player_sleeper';
import mongoose from 'mongoose';
import config from './config/config';
const app = express();

mongoose.connect(config.URI)

app.use(express.json())
app.use('/sleeper_player', player_sleeper_router)
app.get('/healthcheck', (req, res) => {
    res.send("Healthy");
});

export default app
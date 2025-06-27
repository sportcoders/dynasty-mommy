import app, { AppDataSource } from './app'
import config from './config/config';
import { connectToDB } from './db';
import { logger } from './middleware/logger';


const start = async () => {
    await connectToDB(config.URI, AppDataSource)
    app.listen(config.port, () => {
        console.log(`Sever listening on port ${config.port}`);
    })
}

start()

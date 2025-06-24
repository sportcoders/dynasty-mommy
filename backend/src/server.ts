import app from './app'
import config from './config/config';
import { connectToDB } from './db';
import { logger } from './middleware/logger';


const start = async () => {
    await connectToDB(config.URI)
    app.listen(config.port, () => {
        console.log(`Sever listening on port ${config.port}`);
    })
}

start()

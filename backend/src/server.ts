import app, { AppDataSource } from './app'
import config from './config/config';
import { connectToDB, initDatasource } from './db';
import { logger } from './middleware/logger';


const start = async () => {
    await connectToDB(config.URI)
    await initDatasource(AppDataSource)

    app.listen(config.port, () => {
        console.log(`Sever listening on port ${config.port}`);
    })
}

start()

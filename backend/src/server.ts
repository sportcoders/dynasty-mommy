import { AppDataSource, init_app } from './app'
import config from './config/config';
import { connectToDB, initDatasource } from './db';
import { logger } from './middleware/logger';
import { createAppDataSource } from './orm';


const start = async () => {
    try {
        await connectToDB(config.URI)
        const datasource = createAppDataSource(config.URL)
        await initDatasource(datasource)
        const app = init_app(datasource)
        app.listen(config.port, () => {
            console.log(`Sever listening on port ${config.port}`);
        })
    }
    catch (err) {
        console.log("failed to start server", err)
    }
}

start()

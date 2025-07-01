import mongoose from "mongoose";
import { connectToDB } from "../db";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createAppDataSource } from "../orm";
import { DataSource } from "typeorm";
import { init_app } from "../app";
import { Express } from "express";

let mongod: any;
let app: Express;
let testDataSource: DataSource
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectToDB(uri);
    testDataSource = createAppDataSource("sqlite")
    await testDataSource.initialize()
});
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();

    if (testDataSource && testDataSource.isInitialized) {
        await testDataSource.destroy();
    }

});
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

export const init_app_test = () => {
    app = init_app(testDataSource)
}
export const clean_db = async () => {
    if (testDataSource && testDataSource.isInitialized) {
        const entities = testDataSource.entityMetadatas;

        if (testDataSource.options.type === 'sqlite') {
            await testDataSource.query('PRAGMA foreign_keys = OFF');
        }

        for (const entity of entities) {
            const repository = testDataSource.getRepository(entity.name);
            await repository.clear();
        }

        if (testDataSource.options.type === 'sqlite') {
            await testDataSource.query('PRAGMA foreign_keys = ON');
        }
    }
}
export { testDataSource, app }
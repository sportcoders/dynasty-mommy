import mongoose from "mongoose";
import { connectToDB } from "../db";
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongod: any;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectToDB(uri);
});
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});

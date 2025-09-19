import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    URI: string;
    JWT_SECRET: string;
    salt_rounds: number;
    URL: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    ESPN_SECRET_KEY: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    URI: process.env.DB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || "JWT_SECRET",
    salt_rounds: Number(process.env.SALT_ROUNDS) || 10,
    URL: process.env.DB_URL || '',
    CONSUMER_KEY: process.env.CONSUMER_KEY || '',
    CONSUMER_SECRET: process.env.CONSUMER_SECRET || '',
    ESPN_SECRET_KEY: process.env.ESPN_SECRET_KEY || ''
};

export default config;
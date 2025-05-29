import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    URI: string;
    JWT_SECRET: string;
    salt_rounds: number
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    URI: process.env.DB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || "JWT_SECRET",
    salt_rounds: Number(process.env.SALT_ROUNDS) || 10
};

export default config;
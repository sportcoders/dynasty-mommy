import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();


const configSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.string().default('development'),
    DB_URI: z.string(),
    DB_URL: z.string(),
    SALT_ROUNDS: z.coerce.number().default(10),
    JWT_SECRET: z.string(),
    SECRET_KEY: z.string(),
});
const env = configSchema.parse(process.env);

const config = {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    URI: env.DB_URI,
    JWT_SECRET: env.JWT_SECRET,
    salt_rounds: env.SALT_ROUNDS,
    SECRET_KEY: env.SECRET_KEY,
    URL: env.DB_URL,
};

export default config;
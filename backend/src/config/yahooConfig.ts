import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const yahooEnvSchema = z.object({
    YAHOO_CONSUMER_KEY: z.string(),
    YAHOO_CONSUMER_SECRET: z.string(),
    YAHOO_STATE_SECRET: z.string(),
    YAHOO_REDIRECT_URI: z.string()

});
const yahooEnv = yahooEnvSchema.parse(process.env);

export const yahooConfig = {
    CONSUMER_KEY: yahooEnv.YAHOO_CONSUMER_KEY,
    CONSUMER_SECRET: yahooEnv.YAHOO_CONSUMER_SECRET,
    STATE_SECRET: yahooEnv.YAHOO_STATE_SECRET,
    REDIRECT_URI: yahooEnv.YAHOO_REDIRECT_URI,
    API_URL: `https://fantasysports.yahooapis.com/fantasy/v2`,

    get authHeader(): string {
        return Buffer.from(`${yahooEnv.YAHOO_CONSUMER_KEY}:${yahooEnv.YAHOO_CONSUMER_SECRET}`, 'binary')
            .toString('base64');
    },

    get defaultValues() {
        return {
            client_id: yahooEnv.YAHOO_CONSUMER_KEY!,
            client_secret: yahooEnv.YAHOO_CONSUMER_SECRET!,
            redirect_uri: yahooEnv.YAHOO_REDIRECT_URI!,
        };
    },
};
import { serverGet, serverPost } from "@services/sleeper";

// Espn Cookie Type 
interface EspnCookiePayload {
    swid: string,
    espn_s2: string,
}

/**
 * Saves or updates a user's ESPN authentication cookies in the database via manual input from UI form.
 *
 * @param payload - A JSON payload with the ESPN cookies
 */
export async function syncAccount(payload: EspnCookiePayload) {
    await serverPost('/espn/cookies', payload);
}


// ESPN status response Type
interface StatusResponse {
    isSynced: boolean,
}

/**
 * Checks if user has ESPN authentication cookies in the database.
 */
export async function getEspnStatus(): Promise<boolean> {
    const response = await serverGet<StatusResponse>('/espn/status');

    return response?.isSynced ?? false;
}
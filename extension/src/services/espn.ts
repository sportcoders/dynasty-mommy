import { serverPost } from "./apiClient";
import type { ESPNCookies } from "../types";

export async function syncAccount(payload: ESPNCookies) {
    try {
        const response = await serverPost('/espn/cookies', payload);

        return response;
    }
    catch (e) {
        throw e;
    }
}

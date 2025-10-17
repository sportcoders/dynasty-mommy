import { serverPost } from "@services/sleeper";
import type { SaveLeaguePayload } from "./types";

/**
 * Save ESPN league to user.
 * 
 * @param payload - The SaveLeague payload that contains the league_id to save
 */
export async function saveLeague(payload: SaveLeaguePayload) {
    await serverPost('/espn/league', payload);
}
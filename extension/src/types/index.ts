export type ExtensionMessage =
    | { type: "GET_COOKIES"; }
    | { type: "SYNC_TEAM"; leagueId: string; }; // ✅ new message type


export interface ESPNCookies {
    swid: string | null;
    espn_s2: string | null;
    isValid: boolean;
}

export interface ExtensionResponse {
    success: boolean;
    error?: string;
    cookies?: ESPNCookies;
    syncedTeam?: {
        leagueId: string;
        timestamp: number;
    };
}

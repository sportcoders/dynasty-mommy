export type ExtensionMessage =
    | { type: "GET_COOKIES"; }; // only message we send now


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

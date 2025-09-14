export interface ESPNCookies {
    swid: string | null;
    espn_s2: string | null;
    extractedAt: string;
    isValid: boolean;
    extractedFromESPNPage?: boolean;
}

export interface ExtensionMessage {
    type: 'GET_COOKIES' | 'COOKIES_EXTRACTED' | 'COPY_TO_CLIPBOARD';
    payload?: any;
}

export interface CookieExtractionResult {
    success: boolean;
    cookies?: ESPNCookies;
    error?: string;
}
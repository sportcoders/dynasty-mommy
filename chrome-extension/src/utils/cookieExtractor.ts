import { ESPNCookies, CookieExtractionResult } from '../types';

export class CookieExtractor {
    static async extractFromChrome(): Promise<CookieExtractionResult> {
        try {
            const [swidCookie, espnS2Cookie] = await Promise.all([
                chrome.cookies.get({
                    url: 'https://fantasy.espn.com',
                    name: 'SWID'
                }),
                chrome.cookies.get({
                    url: 'https://fantasy.espn.com',
                    name: 'espn_s2'
                })
            ]);

            const cookies: ESPNCookies = {
                swid: swidCookie?.value || null,
                espn_s2: espnS2Cookie?.value || null,
                extractedAt: new Date().toISOString(),
                isValid: !!(swidCookie?.value && espnS2Cookie?.value)
            };

            return {
                success: true,
                cookies
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    static async extractFromDocument(): Promise<ESPNCookies> {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value;
            return acc;
        }, {} as Record<string, string>);

        return {
            swid: cookies.SWID || null,
            espn_s2: cookies.espn_s2 || null,
            extractedAt: new Date().toISOString(),
            isValid: !!(cookies.SWID && cookies.espn_s2)
        };
    }

    static formatForEnv(cookies: ESPNCookies): string {
        return `# ESPN Fantasy Football Credentials
# Extracted on: ${cookies.extractedAt}
SWID=${cookies.swid || ''}
ESPN_S2=${cookies.espn_s2 || ''}
`;
    }

    static formatForJSON(cookies: ESPNCookies): string {
        return JSON.stringify(cookies, null, 2);
    }
}
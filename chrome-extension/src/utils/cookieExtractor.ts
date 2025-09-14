import { ESPNCookies, CookieExtractionResult } from '../types';

export class CookieExtractor {
    static async extractFromChrome(): Promise<CookieExtractionResult> {
        try {
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const isOnESPN = activeTab.url?.includes('espn.com') || false;

            if (!isOnESPN) {
                return {
                    success: false,
                    error: 'Must be on ESPN website to extract cookies'
                };
            }

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

            if (!cookies.isValid) {
                return {
                    success: false,
                    error: 'No valid ESPN cookies found. Please log in to ESPN Fantasy Football.'
                };
            }

            return {
                success: true,
                cookies
            };
        } catch (error) {
            console.error('Cookie extraction error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
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
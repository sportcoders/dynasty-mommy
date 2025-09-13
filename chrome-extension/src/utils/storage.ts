import { ESPNCookies } from '../types';

export class StorageManager {
    static async saveCookies(cookies: ESPNCookies): Promise<void> {
        await chrome.storage.local.set({
            espnCookies: cookies,
            lastExtracted: cookies.extractedAt
        });
    }

    static async getCookies(): Promise<ESPNCookies | null> {
        const result = await chrome.storage.local.get('espnCookies');
        return result.espnCookies || null;
    }

    static async clearCookies(): Promise<void> {
        await chrome.storage.local.remove(['espnCookies', 'lastExtracted']);
    }
}
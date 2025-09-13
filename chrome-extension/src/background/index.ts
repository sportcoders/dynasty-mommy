import { ExtensionMessage, CookieExtractionResult } from '../types';
import { CookieExtractor } from '../utils/cookieExtractor';
import { StorageManager } from '../utils/storage';

chrome.runtime.onMessage.addListener(
    (message: ExtensionMessage, sender, sendResponse) => {
        if (message.type === 'GET_COOKIES') {
            handleGetCookies().then(sendResponse);
            return true; // Keep message channel open for async response
        }
    }
);

async function handleGetCookies(): Promise<CookieExtractionResult> {
    try {
        const result = await CookieExtractor.extractFromChrome();

        if (result.success && result.cookies) {
            await StorageManager.saveCookies(result.cookies);
        }

        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to extract cookies'
        };
    }
}

// Show notification when cookies are extracted
chrome.runtime.onInstalled.addListener(() => {
    console.log('ESPN Cookie Extractor installed');
});
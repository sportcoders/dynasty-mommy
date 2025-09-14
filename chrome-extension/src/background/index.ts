import { ExtensionMessage, CookieExtractionResult } from '../types';
import { CookieExtractor } from '../utils/cookieExtractor';

chrome.runtime.onMessage.addListener(
    (message: ExtensionMessage, sender, sendResponse) => {
        if (message.type === 'GET_COOKIES') {
            handleGetCookies().then(sendResponse);
            return true;
        }
    }
);

async function handleGetCookies(): Promise<CookieExtractionResult> {
    try {
        const result = await CookieExtractor.extractFromChrome();

        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to extract cookies'
        };
    }
}

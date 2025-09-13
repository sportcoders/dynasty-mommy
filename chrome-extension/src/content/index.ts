import { CookieExtractor } from '../utils/cookieExtractor';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_COOKIES') {
        CookieExtractor.extractFromDocument().then(cookies => {
            sendResponse({ success: true, cookies });
        }).catch(error => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});

// Auto-detect when user visits ESPN Fantasy
if (window.location.hostname.includes('espn.com') &&
    window.location.pathname.includes('fantasy')) {
    console.log('ESPN Fantasy Football detected');
}
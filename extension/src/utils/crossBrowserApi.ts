export const BrowserAPI = (() => {
    // Check if browser API is available (Firefox)
    if (typeof browser !== 'undefined' && browser.cookies) {
        return browser;
    }

    // Check if chrome API is available (Chrome, Edge)
    if (typeof chrome !== 'undefined' && chrome.cookies) {
        return chrome;
    }

    throw new Error('Browser extension APIs not available');
})();
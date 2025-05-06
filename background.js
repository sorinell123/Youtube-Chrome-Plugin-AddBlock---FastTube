// Initialize storage on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        totalAds: 0,
        currentPageAds: 0,
        lastBlocked: null
    });
    console.log('YouTube Ad Blocker installed');
});

// Reset current page count when navigating to a new YouTube page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab?.url?.includes('youtube.com')) {
        chrome.storage.local.set({ currentPageAds: 0 });
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'adBlocked') {
        // Update statistics
        chrome.storage.local.get(['totalAds', 'currentPageAds'], (result) => {
            chrome.storage.local.set({
                totalAds: (result.totalAds || 0) + 1,
                currentPageAds: (result.currentPageAds || 0) + 1,
                lastBlocked: new Date().toISOString()
            }, () => {
                // Check for active ports before sending message
                chrome.runtime.sendMessage({ type: 'statsUpdated' }).catch(() => {
                    // Ignore errors when popup is closed
                    console.debug('Popup not active, stats will update when opened');
                });
            });
        });
    }
});

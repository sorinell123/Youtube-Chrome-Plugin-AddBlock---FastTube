// Update stats in popup with error handling
function updateStats() {
    try {
        chrome.storage.local.get(['totalAds', 'currentPageAds', 'lastBlocked'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Error fetching stats:', chrome.runtime.lastError);
                return;
            }

            try {
                document.getElementById('totalAds').textContent = result.totalAds || 0;
                document.getElementById('currentPageAds').textContent = result.currentPageAds || 0;
                
                const lastBlocked = result.lastBlocked 
                    ? new Date(result.lastBlocked).toLocaleString()
                    : 'Never';
                document.getElementById('lastBlocked').textContent = `Last blocked: ${lastBlocked}`;
            } catch (err) {
                console.error('Error updating DOM:', err);
            }
        });
    } catch (err) {
        console.error('Error in updateStats:', err);
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    // Initial stats update
    updateStats();

    // Set up message listener
    try {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'statsUpdated') {
                updateStats();
            }
            // Ensure the message channel stays open
            return true;
        });
    } catch (err) {
        console.error('Error setting up message listener:', err);
    }

    // Periodic updates while popup is open
    const updateInterval = setInterval(updateStats, 1000);

    // Cleanup on popup close
    window.addEventListener('unload', () => {
        clearInterval(updateInterval);
    });
});

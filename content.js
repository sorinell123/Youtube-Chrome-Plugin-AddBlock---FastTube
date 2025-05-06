// Function to remove ad elements
function removeAds() {
    let adsFound = false;

    // Remove video ads
    const videoAds = document.querySelectorAll('.video-ads');
    const playerAds = document.querySelectorAll('.ytp-ad-player-overlay');
    const displayAds = document.querySelectorAll('.ytd-display-ad-renderer');
    const masthead = document.querySelectorAll('.ytd-video-masthead-ad-v3-renderer');
    
    const adElements = [
        ...videoAds,
        ...playerAds,
        ...displayAds,
        ...masthead
    ];

    adElements.forEach(ad => {
        if (ad) {
            ad.remove();
            adsFound = true;
        }
    });

    // Click skip ad button if it exists
    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) {
        skipButton.click();
        adsFound = true;
    }

    // Remove overlay ads
    const overlayAds = document.querySelector('.ytp-ad-overlay-container');
    if (overlayAds) {
        overlayAds.remove();
        adsFound = true;
    }

    // Notify if any ads were blocked
    if (adsFound) {
        chrome.runtime.sendMessage({ type: 'adBlocked' });
    }
}

// Function to skip ads
function skipAd() {
    const video = document.querySelector('video');
    if (video && video.duration) {
        video.currentTime = video.duration;
    }
}

// Initialize the ad blocker
function initAdBlocker() {
    // Create observer to watch for dynamically loaded ads
    const observer = new MutationObserver(() => {
        removeAds();
        
        // Check if video is playing an ad
        const playerAds = document.querySelector('.ad-showing');
        if (playerAds) {
            skipAd();
        }
    });

    // Ensure body exists before observing
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        removeAds(); // Initial check
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdBlocker);
} else {
    initAdBlocker();
}

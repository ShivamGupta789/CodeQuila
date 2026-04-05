// Function to draw a warning box if desired (optional now, but good to keep)
function highlightDeepfake(element, score) {
    element.style.outline = "5px solid #ff4444";
    element.title = `Deepfake detected (${Math.round(score * 100)}% confidence)`;
}

// Listen for message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "triggerScan") {
        scanPageForMedia()
            .then(result => {
                sendResponse(result);
            })
            .catch(err => {
                sendResponse({ success: false, error: err.toString() });
            });
            
        // Return true for async response
        return true;
    }
});

async function scanPageForMedia() {
    let highestScore = 0;
    let scannedCount = 0;
    
    // 1. Collect all media URLs
    const mediaToAnalyze = [];

    const images = Array.from(document.querySelectorAll('img'));
    images.forEach(img => {
        if (img.src && !img.src.startsWith('data:')) {
            mediaToAnalyze.push({ element: img, type: "image", url: img.src });
        }
    });

    const videos = Array.from(document.querySelectorAll('video'));
    videos.forEach(video => {
        let videoSrc = video.src || (video.querySelector('source') ? video.querySelector('source').src : null);
        if (videoSrc) {
            mediaToAnalyze.push({ element: video, type: "video", url: videoSrc });
        }
    });

    const audios = Array.from(document.querySelectorAll('audio'));
    audios.forEach(audio => {
        let audioSrc = audio.src || (audio.querySelector('source') ? audio.querySelector('source').src : null);
        if (audioSrc) {
            mediaToAnalyze.push({ element: audio, type: "audio", url: audioSrc });
        }
    });

    if (mediaToAnalyze.length === 0) {
        return { success: true, highestScore: 0, scannedCount: 0 };
    }

    // 2. Send requests to background script for each media item
    const promises = mediaToAnalyze.map(media => {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                { action: "analyzeMedia", mediaType: media.type, mediaData: media.url }, 
                (response) => {
                    if (response && response.success && response.result) {
                        const confidence = response.result.confidence || 0;
                        const isFake = response.result.isDeepfake;
                        
                        // We assume confidence goes from 0 to 1
                        // If it's explicitly fake, we use confidence. If it says it's real, 
                        // we can either use (1 - confidence) or 0. 
                        // For simplicity, let's just use confidence if 'isDeepfake' is true.
                        let simulatedScore = isFake ? confidence : (1 - confidence);
                        
                        // Apply visual red box if it's over a certain threshold (e.g., > 50%)
                        if (simulatedScore > 0.5) {
                            highlightDeepfake(media.element, simulatedScore);
                        }

                        resolve(simulatedScore);
                    } else {
                        // Error or no valid response for this single item
                        resolve(0);
                    }
                }
            );
        });
    });

    // 3. Wait for all requests to finish and summarize
    const scores = await Promise.all(promises);
    scannedCount = scores.length;
    highestScore = Math.max(...scores); // Get the maximum score found on the page

    return { 
        success: true, 
        highestScore: highestScore, 
        scannedCount: scannedCount 
    };
}

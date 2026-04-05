const LOCAL_API_URL = "http://127.0.0.1:8000/detect";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeMedia") {
        fetch(LOCAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                type: request.mediaType,
                data: request.mediaData 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            sendResponse({ success: true, result: data });
        })
        .catch(error => {
            console.error("Deepfake detector error:", error);
            sendResponse({ success: false, error: error.message });
        });

        // Return true to indicate we will send a response asynchronously
        return true; 
    }
});

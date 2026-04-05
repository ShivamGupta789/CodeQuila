document.addEventListener('DOMContentLoaded', () => {
    const detectBtn = document.getElementById('detectBtn');
    const resultContainer = document.getElementById('resultContainer');
    const scoreValue = document.getElementById('scoreValue');
    const detailsText = document.getElementById('detailsText');

    detectBtn.addEventListener('click', async () => {
        // UI changes for loading state
        detectBtn.disabled = true;
        detectBtn.innerText = "Scanning page...";
        resultContainer.classList.add('hidden');
        
        try {
            // Get the active tab in the current window
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                showError("Cannot access current tab.");
                return;
            }

            // Send a message to content.js in that tab to start scanning
            chrome.tabs.sendMessage(tab.id, { action: "triggerScan" }, (response) => {
                if (chrome.runtime.lastError) {
                    // This happens if content.js isn't loaded (like on a chrome:// page)
                    showError("Cannot scan this page type.");
                    return;
                }

                if (response && response.success) {
                    showResult(response.highestScore, response.scannedCount);
                } else if (response && response.error) {
                    showError(response.error);
                } else {
                    showError("Unknown error occurred.");
                }
            });
        } catch (error) {
            showError("An error occurred during scan.");
        }
    });

    function showResult(highestScore, scannedCount) {
        detectBtn.disabled = false;
        detectBtn.innerText = "Detect Deepfake";
        
        resultContainer.classList.remove('hidden');
        
        if (scannedCount === 0) {
            scoreValue.innerText = "-";
            scoreValue.style.color = "#888";
            detailsText.innerText = "No readable media found on page.";
            return;
        }

        // Convert decimal confidence to percentage
        const percentage = Math.round(highestScore * 100);
        scoreValue.innerText = `${percentage}%`;
        
        if (percentage > 70) {
            scoreValue.style.color = "#ff4444"; // Red for high probability
        } else if (percentage > 40) {
            scoreValue.style.color = "#ffa500"; // Orange for medium
        } else {
            scoreValue.style.color = "#28a745"; // Green for low
        }

        detailsText.innerText = `Highest score among ${scannedCount} media item(s)`;
    }

    function showError(message) {
        detectBtn.disabled = false;
        detectBtn.innerText = "Detect Deepfake";
        resultContainer.classList.remove('hidden');
        scoreValue.innerText = "Error";
        scoreValue.style.color = "#ff4444";
        detailsText.innerText = message;
    }
});

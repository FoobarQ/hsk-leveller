let isActive = false;
chrome.action.onClicked.addListener((tab) => {
    if (isActive) {
        isActive = false;
        chrome.tabs.reload();
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['leveller.js']
    });
    isActive = true;
});
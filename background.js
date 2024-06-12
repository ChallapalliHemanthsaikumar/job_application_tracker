// background.js

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
  });
  

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.idToken) {
      // Process the ID token if needed
      
    }
  });
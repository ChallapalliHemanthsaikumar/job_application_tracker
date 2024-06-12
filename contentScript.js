// contentScript.js

const createSidebar = () => {
    let sidebar = document.createElement('div');
    sidebar.id = 'jobTrackerSidebar';
  
    let iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('sidebar.html');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
  
    sidebar.appendChild(iframe);
    document.body.appendChild(sidebar);
  };
  
  const toggleSidebar = () => {
    let sidebar = document.getElementById('jobTrackerSidebar');
    if (sidebar) {
      sidebar.remove();
    } else {
      createSidebar();
    }
  };
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleSidebar') {
      toggleSidebar();
    }
  });
  
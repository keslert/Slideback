let windowId = 0;
const CONTEXT_MENU_ID = 'slideback_context_menu';

function closeIfExist() {
  if (windowId > 0) {
    chrome.windows.remove(windowId);
    windowId = chrome.windows.WINDOW_ID_NONE;
  }
}

function popWindow(type) {
  closeIfExist();
  const options = {
    type: 'popup',
    left: 100, top: 100,
    width: 1000, height: 600
  };
  if (type === 'open') {
    options.url = 'window.html';
    chrome.windows.create(options, (win) => {
      windowId = win.id;
    });
  }
}

chrome.contextMenus.create({
  id: CONTEXT_MENU_ID,
  title: 'Slideback',
  contexts: ['all'],
  // documentUrlPatterns: [
  //   'https://github.com/*',
  // ]
});

chrome.contextMenus.onClicked.addListener((event) => {
  if (event.menuItemId === CONTEXT_MENU_ID) {
    popWindow('open');
  }
});

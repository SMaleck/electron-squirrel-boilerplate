/*---------------------------------------------------------------
* MOCK - BrowserWindow
*
* RESPONSIBILITY:
* > Mocks the electron browserwindow module
* > Fakes Events and current URL
*--------------------------------------------------------------*/
const self = {};
self.thisIsAMock = true;

const webContents = {};
webContents.currentURL = '';

// Get the URL
webContents.getURL = function getURL() {
  return webContents.currentURL;
};

// Event Listener Registry
webContents.cb_WillNavigate = {};
webContents.cb_FinishedLoad = {};

webContents.on = function on(eventName, callback) {
  switch (eventName) {
    case 'will-navigate':
      webContents.cb_WillNavigate = callback;
      break;

    case 'did-finish-load':
      webContents.cb_FinishedLoad = callback;
      break;

    default:
      break;
  }
};


self.webContents = webContents;

// ---------------------------------------------------+

// Set URL normally, will fire events
self.loadURL = function loadURL(URL) {
  if (typeof webContents.cb_WillNavigate === 'function') { webContents.cb_WillNavigate(); }
  webContents.currentURL = URL;
  if (typeof webContents.cb_FinishedLoad === 'function') { webContents.cb_FinishedLoad(); }
};


// Set URL without setting off anz events
self.loadURLSilent = function loadURLSilent(URL) {
  webContents.currentURL = URL;
};


self.setMenu = function setMenu() {};


// ---------------------------------------------------+
module.exports = self;

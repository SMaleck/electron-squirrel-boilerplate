/*-----------------------------------
* MOCK MODULE
-----------------------------------*/

const electron = {};

// App Mock
electron.app = {
  exePath: 'executable',
  appPath: 'application',

  getPath: function getPath() {
    return this.exePath;
  },

  getAppPath: function getAppPath() {
    return this.appPath;
  },

  getVersion: () => { },

  isDefaultProtocolClient: () => { },

  setAsDefaultProtocolClient: () => { },

  quit: function quit() { }
};


// IPC Mock
electron.ipcMain = {
  on: function on() { }
};


// Auto Updater mock
electron.autoUpdater = {
  elecAU: this,
  didQuitAndInstall: false,
  feedURL: '',
  listeners: {},

  setFeedURL: function (feed) {
    this.feedURL = feed;
  },

  addListener: function (eventId, eventFunc) {
    eventId = eventId.split('-').join('_');
    Object.defineProperty(this.listeners, eventId, { value: eventFunc });
  },

  checkForUpdates: function () { },

  quitAndInstall: function () {
    this.didQuitAndInstall = true;
  }
};


// ------------------------------------+
module.exports = electron;

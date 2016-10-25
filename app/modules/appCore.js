/*---------------------------------------------------
* APPLICATION CORE
*--------------------------------------------------*/

// External Modules
const app = require('electron').app;
const ipcMain = require('electron').ipcMain;

// Internal Modules
const logger = require('./util/logger');
const clArgs = require('./commandLineArgs');
const config = require('./config/config');


// ---------------------------------------------------+
// Public Interface
const self = {};

self.init = function () {
  startUpLog();

  process.argv = clArgs.cache.restoreCache();
  clArgs.init();

  config.apply();
};


self.start = function start(mainWindow) {
  config.WINDOW = mainWindow;
  config.WINDOW.loadURL(`file://${app.getAppPath()}/pages/index.html`);

  // Sent log to IPC on request
  ipcMain.on('ipc-to-main', () => {
    config.WINDOW.webContents.send('ipc-to-renderer', logger.getLog());
  });
};


// ---------------------------------------------------+
function startUpLog() {
  Log('Application Startup');
  Log(`Version : ${app.getVersion()}`);
  Log(`Electron: ${process.versions.electron}`);
  Log('ProcessArgs:');
  process.argv.forEach((element) => {
    Log(`   ${element}`);
  }, this);
}


// ---------------------------------------------------+
module.exports = self;

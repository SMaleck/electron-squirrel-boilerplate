/*------------------------------------------------
* AUTO UPDATE EVENT HANDLER
------------------------------------------------*/

const config = require('../config/config');
const clArgs = require('../commandLineArgs');

const autoUpdater = require('electron').autoUpdater;

let resume;
let stop;

const start = function start() {
  return new Promise((resolve, reject) => {
    // Do not check for updates on unbuilt or OSX
    if (config.DEV || process.platform === 'darwin') {
      resolve();
      return;
    }

    Log('UpdateHandler Started');

    // Store promise settling for event use
    resume = resolve;
    stop = reject;

    autoUpdater.setFeedURL(config.UPDATEURL);
    autoUpdater.checkForUpdates();
  });
};


autoUpdater.addListener('checking-for-update', () => {
  Log('UpdateHandler: Checking for updates');
});

autoUpdater.addListener('update-available', () => {
  Log('UpdateHandler: Newer version is available');
});

autoUpdater.addListener('update-not-available', () => {
  Log('UpdateHandler: No update available');
  resume();
});

autoUpdater.addListener('update-downloaded', () => {
  Log('UpdateHandler: Update downloaded');

  // Cache command line arguments to read them again after update
  clArgs.cache.cacheToFile();

  // Auto Updater will start the Update.exe which takes care of the rest
  autoUpdater.quitAndInstall();

  stop();
});

autoUpdater.addListener('error', (error) => {
  Log(`UpdateHandler: Error > ${error.message}`);
  resume();
});


// ------------------------------------------------------+
module.exports = start;

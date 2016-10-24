'use strict';

// Main Application Modules
var electron = require('electron');
var appCore = require('./modules/appCore');
var config = require('./modules/config/config');

// Auto Updating
var squirrelHandler = require('./modules/update/squirrelHandler');
var updateHandler = require('./modules/update/updateHandler');

// Application life and browser window
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

// First page to load when window gets created
var defaultPage = 'file://' + __dirname + '/pages/loading.html';

// Window Options
var windowOptions = {
  title: 'Boilerplate',
  useContentSize: true,
  center: true,
  resizable: true,
  maximizable: true,
  frame: true
};


// Inject logging module into global space
global.Log = require('./modules/util/logger').log;

// --------------------------------------------------------------------+
// Initialize core application config, including loading of the argument cache
appCore.init();

// On each start we setup the current EXE as default Protocol Client
setupProtocol();


// --------------------------------------------------------------------+
// On startup the Squirrel Handler checks for Squirrel events send through command line
// If it needs to quit the application and run Update.exe it will return true
// Then we stop further execution here as well
if (squirrelHandler.handleEvents()) {
  return;
}


// --------------------------------------------------------------------+
// Add the Application Lifecycle listeners

// Runs when Electron has finished initialization
app.on('ready', start);

// Quit when all windows are closed
app.on('window-all-closed', app.quit);


// --------------------------------------------------------------------+
// Electron Window Creation and App init
function start() {
  createWindow();

  // Update Handler checks for updates and downloads them
  // When there is an update it will quit and update the application, so the promise will be rejected
  // Otherwise it resolves and we can start the authenticator
  updateHandler()
    .then(function () {
      // Start the authenticator application
      Log('Updater done, continuing');
      appCore.start(mainWindow);
    })
    .catch(function () {
      // Don't do anything if the Updater takes action
      Log('Updater induced Exit');
    });
}


// Create the browser window with the defined options
function createWindow() {
  mainWindow = new BrowserWindow(windowOptions);
  mainWindow.loadURL(defaultPage);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}


// Sets up the current EXE as the default target for our prototcol
function setupProtocol() {
  // Do not proceed if on DEV or OSX
  if (config.DEV || process.platform === 'darwin') {
    return false;
  }

  if (!app.isDefaultProtocolClient(config.PROTOCOLID)) {
    app.setAsDefaultProtocolClient(config.PROTOCOLID);
  }
}

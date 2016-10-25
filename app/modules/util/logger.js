const config = require('../config/config');
const fs = require('fs');
const path = require('path');
const Console = require('console').Console;

const fileTimeStamp = makeTimestamp();
let output = null;
let logConsole = null;
const logCache = [];

const self = {};

// --------------------------------------------------+
self.log = function (message) {
  const logMessage = `[${new Date().toISOString()}] ${message}`;

  // eslint-disable-next-line no-console
  console.log(logMessage);
  logCache.push(logMessage);

  if (logConsole) {
    logConsole.log(logMessage);
  }
  else {
    setupLogOutput();
  }

  // Sent to IPC
  if (config.WINDOW) {
    config.WINDOW.webContents.send('ipc_to_renderer', logMessage);
  }
};


self.getLog = () => {
  return logCache;
};


// Checks if the log file can be created and does that
function setupLogOutput() {
  if (config.ROOTDIR === '') {
    return;
  }

  // Create logfile and write cached entries
  if (!logConsole) {
    setupLogConsole();

    // Flush Cahce into output file
    logCache.forEach((entry) => {
      logConsole.log(entry);
    });
  }
}


// --------------------------------------------------+

// Creates the output stream and console
function setupLogConsole() {
  const timestamp = config.DEBUG ? (`_${fileTimeStamp}`) : '';
  const filePath = path.normalize(`${config.ROOTDIR}${path.sep}stdout${timestamp}.log`);

  output = fs.createWriteStream(filePath);
  logConsole = new Console(output);
}


// Creates a filesystem friendly timestamp for the filename
function makeTimestamp() {
  const dt = new Date();

  const date = [
    dt.getUTCFullYear(),
    prefixDateSegment(dt.getUTCMonth() + 1),
    prefixDateSegment(dt.getUTCDate()),
  ];

  const time = [
    prefixDateSegment(dt.getUTCHours()),
    prefixDateSegment(dt.getMinutes()),
    prefixDateSegment(dt.getSeconds()),
  ];

  return `${date.join('-')}_${time.join('-')}`;
}


function prefixDateSegment(segment) {
  return (segment < 10) ? `0${segment}` : segment;
}


// --------------------------------------------------+
// Adds some basic info at the start of the Log
self.log('Logging Started');
self.log(`TimeZone: ${new Date().getTimezoneOffset()} minutes`);


// --------------------------------------------------+
module.exports = self;

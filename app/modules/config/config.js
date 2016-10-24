const clArgs = require('../commandLineArgs');
const app = require('electron').app;
const path = require('path');

const self = {};

self.WINDOW = null;
self.ROOTDIR = '';
self.UPDATEURL = '';

self.PROTOCOLID = 'esbprotocol';
self.DEBUG = true;
self.DEV = false;

self.IPC = {
  main: 'ipc-main',
  render: 'ipc-render'
};

self.ARG = {
  DEBUG: '+debug',
  UPDATEURL: '--updateurl'
};

// ------------------------------------------------------+

self.apply = function apply() {
  self.DEBUG = resolveArgFlag(self.ARG.DEBUG) || self.DEBUG;
  self.DEV = app.getPath('exe').indexOf('electron-prebuilt') >= 0;
  self.ROOTDIR = getRoot();
  self.UPDATEURL = clArgs.getArgumentValue(self.ARG.UPDATEURL) || self.UPDATEURL;
};


// ---------------------------------------------------+
// Helpers

function resolveArgFlag(flagname) {
  const flag = clArgs.getArgumentValue(flagname);

  return flag === 'true' || flag === true;
}


function getRoot() {
  // Override for unbuilt dev environment
  if (self.DEV) {
    return path.normalize(`${__dirname}${path.sep}..${path.sep}..${path.sep}..${path.sep}`);
  }

  return path.dirname(app.getPath('exe'));
}


// ------------------------------------------------------+
module.exports = self;

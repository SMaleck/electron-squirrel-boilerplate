/*-----------------------------------
* MOCK MODULE
-----------------------------------*/

'use strict';

var self = {};

self.statError = null;
self.statData = '';

self.readError = null;
self.readData = '';

self.lastPathRead = '';

// Sync data
self.readDataSync = '';
self.lastDataWriteSync = '';
self.lastPathReadSync = '';
self.lastPathWriteSync = '';

self.stat = function stat(path, callback) {
  if (typeof callback === 'function') { callback(self.statError, self.statData); }
};


self.readFile = function readFile(path, encoding, callback) {
  self.lastPathRead = path;
  if (typeof callback === 'function') { callback(self.readError, self.readData); }
};

self.readFileSync = function readFileSync(path) {
  self.lastPathReadSync = path;
  return self.readDataSync;
};

self.writeFileSync = function writeFileSync(path, data) {
  self.lastPathWriteSync = path;
  self.lastDataWriteSync = data;
};


self.canAccess = true;
self.accessSync = function accessFileSync() {
  if (!self.canAccess) {
    throw 'no way Jose!';
  }
};

self.createWriteStream = function createWriteStream() { };


module.exports = self;

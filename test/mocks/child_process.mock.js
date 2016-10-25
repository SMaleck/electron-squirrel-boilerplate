/*-----------------------------------
* MOCK MODULE
-----------------------------------*/
const self = {};

const process = {
  unref: function () { },
  on: function () { }
};

self.lastExe = '';
self.lastPayload = [];
self.lastOptions = {};

self.spawn = function spawn(executable, clPayload, options) {
  self.lastExe = executable;
  self.lastPayload = clPayload;
  self.lastOptions = options;

  return process;
};

module.exports = self;

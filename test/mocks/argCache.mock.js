/*-----------------------------------
* MOCK MODULE
-----------------------------------*/
const self = {};

self.getArguments = function getArguments() {
  return process.argv;
};

self.cacheArguments = function cacheArguments() { };

module.exports = self;

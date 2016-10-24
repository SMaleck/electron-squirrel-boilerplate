'use strict';

var mockery = require('mockery');

module.exports = {

  start: function () {
    mockery.enable({ useCleanCache: true });
    mockery.warnOnUnregistered(false);
  },


  shutdown: function () {
    mockery.deregisterAll();
    mockery.disable();
    process.env = {};
  },


  resolve: function (moduleName) {
    return './mocks/' + moduleName + '.mock';
  }
};

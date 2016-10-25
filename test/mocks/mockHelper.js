const mockery = require('mockery');

module.exports = {

  start: () => {
    mockery.enable({ useCleanCache: true });
    mockery.warnOnUnregistered(false);
  },


  shutdown: () => {
    mockery.deregisterAll();
    mockery.disable();
    process.env = {};
  },


  resolve: (moduleName) => {
    return './mocks/' + moduleName + '.mock';
  }
};

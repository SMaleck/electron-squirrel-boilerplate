const mockHelper = require('./mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');

let appCore;
let config;


// -----------------------------------------------------------+
describe('APPCORE:', () => {
  // -----------------------------------------------------------+

  before(() => {
    // Setting timeout for this suite to 3000ms. before() would randomly timeout on Windows, because:
    // 1. A high number of modules is being loaded
    // 2. Due to office policies the windows machine is running a lot slower than it should...
    // this.timeout(3000);

    mockHelper.start();
    mockery.registerSubstitute('electron', '../../test/mocks/electron.mock');

    // Load Tested Module
    appCore = require('../app/modules/appCore');
    config = require('../app/modules/config/config');
  });

  after(() => {
    mockHelper.shutdown();
  });

  // -----------------------------------------------------------+
  describe('Application Startup:', () => {
    // -----------------------------------------------------------+

    it('Inits core config and argResolver', () => {
      process.argv = ['', '+debug'];
      appCore.init();

      assert.equal(config.DEBUG, true);
    });

    it('Sets globals.WINDOW to the passed browserWindow', () => {
      appCore.start(require('./mocks/browserwindow.mock'));

      assert.equal(config.WINDOW.thisIsAMock, true);
    });
  });
});

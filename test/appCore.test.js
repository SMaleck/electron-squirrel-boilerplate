'use strict';

var mockHelper = require('./mocks/mockHelper');
var mockery = require('mockery');
var assert = require('assert');

var appCore;
var config;


// -----------------------------------------------------------+
describe('APPCORE:', function () {
  // -----------------------------------------------------------+

  before(function () {
    // Setting timeout for this suite to 3000ms. before() would randomly timeout on Windows, because:
    // 1. A high number of modules is being loaded
    // 2. Due to office policies the windows machine is running a lot slower than it should...
    this.timeout(3000);

    mockHelper.start();
    mockery.registerSubstitute('electron', '../../test/mocks/electron.mock');

    // Load Tested Module
    appCore = require('../app/modules/appCore');
    config = require('../app/modules/config/config');
  });

  after(function () {
    mockHelper.shutdown();
  });

  // -----------------------------------------------------------+
  describe('Application Startup:', function () {
    // -----------------------------------------------------------+

    it('Inits core config and argResolver', function () {
      process.argv = ['', '+debug'];
      appCore.init();

      assert.equal(config.DEBUG, true);
    });

    it('Sets globals.WINDOW to the passed browserWindow', function () {
      appCore.start('IAmFake');

      assert.equal(config.WINDOW, 'IAmFake');
    });
  });
});

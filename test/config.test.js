'use strict';

var mockHelper = require('./mocks/mockHelper');
var mockery = require('mockery');
var assert = require('assert');

var config;

var argResolver;
var mockElectron;
var path = require('path');

// Mocked Data
var coreArgs = [];
var rootDir = 'root' + path.sep + 'dir';

// -----------------------------------------------------------+
describe('CONFIG MODULE', function () {
  // -----------------------------------------------------------+

  beforeEach(function () {
    mockHelper.start();
    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');

    config = require('../app/modules/config/config');
    config.ROOTDIR = rootDir;

    coreArgs = [
      '',
      config.ARG.DEBUG,
      config.UPDATEURL + '=www.google.com'
    ];

    argResolver = require('../app/modules/utilities/argResolver');
    mockElectron = require('./mocks/electron.mock');
  });

  afterEach(function () {
    mockHelper.shutdown();
  });


  it('applies VALID config correctly', function () {
    process.argv = coreArgs;
    argResolver.init();
    mockElectron.app.exePath = '/path/to/executable.exe';

    config.apply();
    assert.equal(config.DEBUG, true);
    assert.equal(config.DEV, false);
    assert.equal(config.ROOTDIR, '/path/to');
  });


  it('Sets config.ROOTDIR to __DIRNAME if on DEV environment', function () {
    process.argv = coreArgs;
    argResolver.init();
    mockElectron.app.exePath = 'path/electron-prebuilt/executable.exe';

    config.apply();
    assert.equal(config.DEV, true);
    assert(config.ROOTDIR.indexOf('electron-squirrel-boilerplate') > 0);
  });
});

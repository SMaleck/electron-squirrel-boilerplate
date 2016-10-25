const mockHelper = require('./mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');

let config;

let clArg;
let mockElectron;
const path = require('path');

// Mocked Data
let coreArgs = [];
const rootDir = `root${path.sep}dir`;

// -----------------------------------------------------------+
describe('CONFIG MODULE', () => {
  // -----------------------------------------------------------+

  beforeEach(() => {
    mockHelper.start();
    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');

    config = require('../app/modules/config/config');
    config.ROOTDIR = rootDir;

    coreArgs = [
      '',
      config.ARG.DEBUG,
      `${config.UPDATEURL}=www.google.com`
    ];

    clArg = require('../app/modules/commandLineArgs');
    mockElectron = require('./mocks/electron.mock');
  });

  afterEach(() => {
    mockHelper.shutdown();
  });


  it('applies VALID config correctly', () => {
    process.argv = coreArgs;
    clArg.init();
    mockElectron.app.exePath = '/path/to/executable.exe';

    config.apply();
    assert.equal(config.DEBUG, true);
    assert.equal(config.DEV, false);
    assert.equal(config.ROOTDIR, '/path/to');
  });


  it('Sets config.ROOTDIR to __DIRNAME if on DEV environment', () => {
    process.argv = coreArgs;
    clArg.init();
    mockElectron.app.exePath = 'path/electron-prebuilt/executable.exe';

    config.apply();
    assert.equal(config.DEV, true);
    assert(config.ROOTDIR.indexOf('electron-squirrel-boilerplate') > 0);
  });
});

const mockHelper = require('../mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');

var config;
var squirrel;

var originalPlatform;
var argV = ['path', 'someArg', '--squirrel-install'];

// -----------------------------------------------------------+
describe('SQUIRREL HANDLER:', function () {
  // -----------------------------------------------------------+

  before(function () {
    mockHelper.start();

    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');
    mockery.registerSubstitute('fs', '../../../test/mocks/fs.mock');
    mockery.registerSubstitute('child_process', '../../../test/mocks/child_process.mock');

    config = require('../../app/modules/config/config');
    squirrel = require('../../app/modules/update/squirrelHandler');

    process.argv = argV;

    // redefine process.platform
    originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
  });

  after(function () {
    mockHelper.shutdown();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    });
  });


  it('Returns TRUE when Squirrel FIRSTRUN Command is present', function () {
    process.argv = ['path', 'someArg', '--squirrel-firstrun'];
    assert(squirrel.handleEvents());
  });

  it('Returns TRUE when Squirrel INSTALL Command is present', function () {
    process.argv = ['path', 'someArg', '--squirrel-install'];
    assert(squirrel.handleEvents());
  });


  it('Returns TRUE when Squirrel UPDATED Command is present', function () {
    process.argv = ['path', 'someArg', '--squirrel-updated'];
    assert(squirrel.handleEvents());
  });


  it('Returns TRUE when Squirrel UNINSTALL Command is present', function () {
    process.argv = ['path', 'someArg', '--squirrel-uninstall'];
    assert(squirrel.handleEvents());
  });


  it('Returns TRUE when Squirrel OBSOLETE Command is present', function () {
    process.argv = ['path', 'someArg', '--squirrel-obsolete'];
    assert(squirrel.handleEvents());
  });


  it('Returns FALSE when Squirrel Command is NOT present', function () {
    process.argv = ['nosquirrelshere'];
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE when Squirrel Command is NOT VALID', function () {
    process.argv = ['path', 'someArg', '--squirrel-stuff'];
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE when array is empty', function () {
    process.argv = [];
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE on DEV Environment', function () {
    process.argv = argV;
    config.DEV = true;
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE on OSX Platform', function () {
    process.argv = argV;
    config.DEV = false;
    Object.defineProperty(process, 'platform', {
      value: 'darwin'
    });
    assert(!squirrel.handleEvents());
  });
});

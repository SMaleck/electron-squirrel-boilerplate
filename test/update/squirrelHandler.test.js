const mockHelper = require('../mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');

let config;
let squirrel;

const argV = ['path', 'someArg', '--squirrel-install'];
const originalPlatform = process.platform;

// -----------------------------------------------------------+
describe('SQUIRREL HANDLER:', () => {
  // -----------------------------------------------------------+

  before(() => {
    mockHelper.start();

    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');
    mockery.registerSubstitute('fs', '../../../test/mocks/fs.mock');
    mockery.registerSubstitute('child_process', '../../../test/mocks/child_process.mock');

    config = require('../../app/modules/config/config');
    squirrel = require('../../app/modules/update/squirrelHandler');

    // redefine process.platform
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
  });

  after(() => {
    mockHelper.shutdown();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    });
  });


  it('Returns TRUE when Squirrel FIRSTRUN Command is present', () => {
    process.argv = ['path', 'someArg', '--squirrel-firstrun'];
    assert(squirrel.handleEvents());
  });

  it('Returns TRUE when Squirrel INSTALL Command is present', () => {
    process.argv = ['path', 'someArg', '--squirrel-install'];
    assert(squirrel.handleEvents());
  });


  it('Returns TRUE when Squirrel UPDATED Command is present', () => {
    process.argv = ['path', 'someArg', '--squirrel-updated'];
    assert(squirrel.handleEvents());
  });


  it('Returns TRUE when Squirrel UNINSTALL Command is present', () => {
    process.argv = ['path', 'someArg', '--squirrel-uninstall'];
    assert(squirrel.handleEvents());
  });


  it('Returns TRUE when Squirrel OBSOLETE Command is present', () => {
    process.argv = ['path', 'someArg', '--squirrel-obsolete'];
    assert(squirrel.handleEvents());
  });


  it('Returns FALSE when Squirrel Command is NOT present', () => {
    process.argv = ['nosquirrelshere'];
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE when Squirrel Command is NOT VALID', () => {
    process.argv = ['path', 'someArg', '--squirrel-stuff'];
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE when array is empty', () => {
    process.argv = [];
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE on DEV Environment', () => {
    process.argv = argV;
    config.DEV = true;
    assert(!squirrel.handleEvents());
  });


  it('Returns FALSE on OSX Platform', () => {
    process.argv = argV;
    config.DEV = false;
    Object.defineProperty(process, 'platform', {
      value: 'darwin'
    });
    assert(!squirrel.handleEvents());
  });
});

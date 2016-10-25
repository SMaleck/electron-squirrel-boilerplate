const mockHelper = require('../mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');

let fsMock;
let cache;


describe('CommandLineArgs - Cache', () => {
  before(() => {
    mockHelper.start();
    mockery.registerSubstitute('fs', '../../../test/mocks/fs.mock');
    fsMock = require('../mocks/fs.mock');

    cache = require('../../app/modules/commandLineArgs/cache');
  });

  beforeEach(() => {
    process.argv = [];
    fsMock.canAccess = true;
  });

  after(() => {
    mockHelper.shutdown();
  });

  it('should store current arguments in local cache file', () => {
    process.argv = ['dropped', '--arg0=1', '--arg1 1'];

    cache.cacheToFile();
    const cachedFile = JSON.parse(fsMock.lastDataWriteSync);
    assert.deepEqual(process.argv, cachedFile);
  });

  it('should restore cache file and wipe current file', () => {
    const argSet = ['dropped', '--arg0=1', '--arg1 1'];
    fsMock.readDataSync = JSON.stringify(argSet);
    process.argv = ['something else'];

    const cachedArgs = cache.restoreCache();
    assert.deepEqual(cachedArgs, argSet);

    // Check that cache was wiped
    assert.equal(fsMock.lastDataWriteSync, '');
  });

  it('should return current args if cache file cannot be read', () => {
    fsMock.canAccess = false;
    process.argv = ['something else'];

    const cachedArgs = cache.restoreCache();
    assert.deepEqual(cachedArgs, process.argv);
  });
});

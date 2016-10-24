'use strict';

var mockHelper = require('../mocks/mockHelper');
var mockery = require('mockery');
var assert = require('assert');

var mockFs;

var argCache;


// -----------------------------------------------------------+
// Mocked Data

var execPath = 'root/path/to/exec.exe';
var expectCachePath = 'root/path/cache.args';
var cachedArgs = [
  'C:/app/root/app.exe',
  'gameArg',
];


// -----------------------------------------------------------+
describe('ARG CACHE:', function () {
  // -----------------------------------------------------------+

  before(function () {
    mockHelper.start();

    mockery.registerSubstitute('./logger', '../../../test/mocks/logger.mock');
    mockery.registerSubstitute('fs', '../../../test/mocks/fs.mock');
    mockFs = require('../mocks/fs.mock');
    process.execPath = execPath;

    argCache = require('../../app/modules/utilities/argCache');
  });

  after(function () {
    mockHelper.shutdown();
  });


  it('getArguments returns PROCESS ARGS if Cache does NOT exist', function () {
    process.argv = ['pArg1', 'pArg2'];
    mockFs.canAccess = false;
    mockFs.readDataSync = JSON.stringify(cachedArgs);

    var args = argCache.getArguments();

    assert.equal(args.length, process.argv.length);
    assert.equal(args[0], process.argv[0]);
    assert.equal(args[1], process.argv[1]);
  });


  it('getArguments returns PROCESS ARGS if Cache is EMPTY', function () {
    process.argv = ['pArg1', 'pArg2'];
    mockFs.canAccess = true;
    mockFs.readDataSync = JSON.stringify('');

    var args = argCache.getArguments();

    assert.equal(args.length, process.argv.length);
    assert.equal(args[0], process.argv[0]);
    assert.equal(args[1], process.argv[1]);
  });


  it('getArguments returns CACHE ARGS if Cache does exists', function () {
    process.argv = ['pArg1', 'pArg2'];
    mockFs.canAccess = true;
    mockFs.readDataSync = JSON.stringify(cachedArgs);

    var args = argCache.getArguments();

    assert.equal(args.length, cachedArgs.length);
    assert.equal(args[0], cachedArgs[0]);
    assert.equal(args[1], cachedArgs[1]);
  });


  it('cacheArguments stores PROCESS ARGS to local FILE', function () {
    process.argv = ['toCache1', 'toCache2'];

    argCache.cacheArguments();

    assert.equal(mockFs.lastDataWriteSync, '["toCache1","toCache2"]');
  });
});

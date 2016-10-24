'use strict';

var mockHelper = require('../mocks/mockHelper');
var assert = require('assert');

var argParser;


// -----------------------------------------------------------+
// Mocked Data
var argsValid = [
  'C:/app/root/app.exe',
  'gameArg',
  '--cmode=default'
];


// -----------------------------------------------------------+
describe('ARG PARSER:', function () {
  // -----------------------------------------------------------+

  before(function () {
    mockHelper.start();

    argParser = require('../../app/modules/utilities/argParser');
  });

  after(function () {
    mockHelper.shutdown();
  });

  // -----------------------------------------------------------+
  describe('Parse Argument String:', function () {
    // -----------------------------------------------------------+

    it('parseArg returns ARRAY of ARGUMENTS', function () {
      var args = argParser.parseArgs('protcol:\\\\ +debug --client_id=123 --exec=game.exe');

      assert.equal(args.length, 3);
      assert.equal(args[0], '+debug');
      assert.equal(args[1], '--client_id=123');
      assert.equal(args[2], '--exec=game.exe');
    });


    it('parseArg returns EMPTY ARRAY for Empty String / NULL', function () {
      var args;

      args = argParser.parseArgs('');
      assert.equal(args.length, 0);

      args = argParser.parseArgs(null);
      assert.equal(args.length, 0);
    });
  });


  // -----------------------------------------------------------+
  describe('Argument Array Merging:', function () {
    // -----------------------------------------------------------+

    it('mergeArgs returns MERGED ARRAY of Arguments (Overrides existing)', function () {
      var originals = ['+debug', '--client_id=123'];
      var overrides = ['+debug', '--client_id=456', '--exec=game.exe'];

      var merged = argParser.mergeArgs(originals, overrides);

      assert.equal(merged.length, 3);
      assert.equal(merged[0], '+debug');
      assert.equal(merged[1], '--client_id=456');
      assert.equal(merged[2], '--exec=game.exe');
    });


    it('mergeArgs returns MERGED ARRAY if one is EMPTY', function () {
      var originals = [];
      var overrides = ['+debug', '--client_id=456', '--exec=game.exe'];

      var merged = null;

      merged = argParser.mergeArgs(originals, overrides);
      assert.equal(merged.length, 3);

      merged = argParser.mergeArgs(overrides, originals);
      assert.equal(merged.length, 3);
    });


    it('mergeArgs returns EMPTY ARRAY if BOTH are EMPTY', function () {
      var merged = argParser.mergeArgs([], []);
      assert.equal(merged.length, 0);
    });
  });


  // -----------------------------------------------------------+
  describe('Get Arguments from Array:', function () {
    // -----------------------------------------------------------+

    it('getIndex returns INDEX if Argument exists', function () {
      var index = argParser.getIndex(['cmode', '+cmode', '-cmode', '--cmodel', '--cmode=steam'], '--cmode');
      assert.equal(index, 4);
    });


    it('getIndex returns INDEX if Argument exists (FlagArg)', function () {
      var index = argParser.getIndex(['debug', '--debug=true', '+debug'], '+debug');
      assert.equal(index, 2);
    });
  });
});

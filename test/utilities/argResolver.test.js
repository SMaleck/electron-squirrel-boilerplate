'use strict';

var mockery = require('mockery');
var mockHelper = require('../mocks/mockHelper');
var assert = require('assert');

var argResolver;


// -----------------------------------------------------------+
// Mocked Data
var argsValid = [
  'C:/app/root/app.exe',
  'gameArg',
  '--cmode=default',
  'protocol:\\\\ +debug'
];


// -----------------------------------------------------------+
describe('ARG RESOLVER:', function () {
  // -----------------------------------------------------------+

  before(function () {
    mockHelper.start();

    mockery.registerSubstitute('./argCache', '../../../test/mocks/argCache.mock');
    argResolver = require('../../app/modules/utilities/argResolver');
  });

  after(function () {
    mockHelper.shutdown();
  });

  // -----------------------------------------------------------+
  describe('Public Interface:', function () {
    // -----------------------------------------------------------+
    it('init stores the ARGs and SORTS them correctly', function () {
      process.argv = argsValid;
      argResolver.init();

      var data = argResolver.dumpErrorData();
      assert.equal(data.mainArgs.length, argsValid.length);
      assert.equal(data.argsMerged.length + data.argsUnknown.length, argsValid.length + 1);
      assert.equal(data.argsMerged[0], argsValid[1]);
      assert.equal(data.argsMerged[1], argsValid[2]);
      assert.equal(data.argsMerged[2], argsValid[3]);
      assert.equal(data.argsMerged[3], '+debug');
      assert.equal(data.argsUnknown[0], argsValid[1]);
    });

    it('init succeeds if given EMPTY array', function () {
      process.argv = [];
      argResolver.init();

      var data = argResolver.dumpErrorData();
      assert.equal(data.mainArgs.length, 0);
      assert.equal(data.argsMerged.length, 0);
      assert.equal(data.argsUnknown.length, 0);
    });

    it('init succeeds if given only IGNORED args', function () {
      process.argv = ['electronPath'];
      argResolver.init();

      var data = argResolver.dumpErrorData();
      assert.equal(data.mainArgs.length, 1);
      assert.equal(data.argsMerged.length, 0);
      assert.equal(data.argsUnknown.length, 0);
    });

    it('init succeeds if given only UNDEFINED args', function () {
      process.argv = ['electronPath', 'gameArg'];
      argResolver.init();

      var data = argResolver.dumpErrorData();
      assert.equal(data.mainArgs.length, 2);
      assert.equal(data.argsMerged.length, 1);
      assert.equal(data.argsUnknown.length, 1);
    });


    // -----------------------------------------------------------------------------+
    // getArgumentValue

    it('getArgumentValue returns CORRECT arg if set using "="', function () {
      process.argv = ['', '--cmode=value'];
      argResolver.init();

      var data = argResolver.getArgumentValue('--cmode');
      assert.equal(data, 'value');
    });

    it('getArgumentValue returns CORRECT arg if set using " "', function () {
      process.argv = ['', '--argname value'];
      argResolver.init();

      var data = argResolver.getArgumentValue('--argname');
      assert.equal(data, 'value');
    });

    it('getArgumentValue returns CORRECT arg if set as FLAG', function () {
      process.argv = ['', '+argname'];
      argResolver.init();

      var data = argResolver.getArgumentValue('+argname');
      assert.equal(data, 'true');
    });

    it('getArgumentValue returns NULL if arg is not set', function () {
      process.argv = ['', '+argname'];
      argResolver.init();

      var data = argResolver.getArgumentValue('+argname2');
      assert.equal(data, null);
    });

    it('getArgumentValue returns correct arg without CONFUSION', function () {
      process.argv = ['', '+argname', '+arg'];
      argResolver.init();
      var data = argResolver.getArgumentValue('+arg');
      assert.equal(data, 'true');

      process.argv = ['', '+argname', '+arg=1', '+arg'];
      argResolver.init();
      var data = argResolver.getArgumentValue('+arg');
      assert.equal(data, '1');
    });


    // -----------------------------------------------------------------------------+
    // getArg

    it('getArg returns COMPLETE arg if set', function () {
      process.argv = ['', '--cmode=value'];
      argResolver.init();

      var data = argResolver.getArg('--cmode');
      assert.equal(data, '--cmode=value');
    });

    it('getArg returns NULL if arg is NOT set', function () {
      process.argv = ['', '--cmode=value'];
      argResolver.init();

      var data = argResolver.getArg('--comode');
      assert.equal(data, null);
    });


    // -----------------------------------------------------------------------------+
    // getForwardingPayload

    it('getForwardingPayload returns ONLY Payload-args if SET', function () {
      process.argv = ['', '+debug', 'ffarg', '--ffarg2'];
      argResolver.init();

      var data = argResolver.getForwardingPayload();
      assert(data);
      assert.equal(data.length, 2);
      assert.equal(data[0], 'ffarg');
      assert.equal(data[1], '--ffarg2');
    });


    it('getForwardingPayload returns EMPTY list if NO payload-args SET', function () {
      process.argv = ['electronpath', '--cmode'];
      argResolver.init();

      var data = argResolver.getForwardingPayload();
      assert(data);
      assert.equal(data.length, 0);
    });


    // -----------------------------------------------------------------------------+
    // error data dumping
    it('dumps complete error data in correct format', function () {
      process.argv = argsValid;
      argResolver.init();

      var errObject = argResolver.dumpErrorData();
      assert(errObject.hasOwnProperty('from'));
      assert(errObject.hasOwnProperty('definedArgNames'));
      assert(errObject.hasOwnProperty('mainArgs'));
      assert(errObject.hasOwnProperty('argsMerged'));
      assert(errObject.hasOwnProperty('argsUnknown'));
    });
  });
});

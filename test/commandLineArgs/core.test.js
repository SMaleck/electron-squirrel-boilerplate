const mockHelper = require('../mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');
let clArg;
let config;

describe('CommandLineArgs - Core', () => {
  before(() => {
    mockHelper.start();
    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');

    clArg = require('../../app/modules/commandLineArgs');
    config = require('../../app/modules/config/config');
  });

  after(() => {
    mockHelper.shutdown();
  });

  it('should orchestrate the parser to expose refined args', () => {
    process.argv = ['dropped', '--arg0=1', '--arg1 1', `${config.PROTOCOLID}:\\\\ +debug --arg1 2`];

    clArg.init();
    const finalArgs = clArg.getAllArguments();
    assert.deepEqual(finalArgs, ['--arg0=1', '--arg1 2', '+debug']);
  });

  it('should find an argument by name', () => {
    process.argv = ['dropped', '--arg0=1', '--arg1 1', `${config.PROTOCOLID}:\\\\ +debug --arg1 2`];

    clArg.init();
    const arg = clArg.getArgument('--arg0');
    assert.equal(arg, '--arg0=1');
  });

  it('should return an argument value by name', () => {
    process.argv = ['dropped', '--arg0=1', '--arg1 1', `${config.PROTOCOLID}:\\\\ +debug --arg1 2`];

    clArg.init();
    const argVal = clArg.getArgumentValue('--arg0');
    assert.equal(argVal, '1');
  });
});

const mockHelper = require('../mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');
let parser;
let config;

describe('CommandLineArgs - Parser', () => {
  before(() => {
    mockHelper.start();
    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');

    parser = require('../../app/modules/commandLineArgs/parser');
    config = require('../../app/modules/config/config');
  });

  after(() => {
    mockHelper.shutdown();
  });

  it('should find the correct protocol arg index', () => {
    const argSet = ['--arg0=1', `${config.PROTOCOLID}:\\\\ +debug`, '--arg1'];

    const index = parser.findProtolArgIndex(argSet);
    assert.equal(index, 1);
  });

  it('should return -1 if there is no protocol arg', () => {
    const argSet = ['--arg0=1', '--arg1'];

    let index = parser.findProtolArgIndex(argSet);
    assert.equal(index, -1);

    index = parser.findProtolArgIndex([]);
    assert.equal(index, -1);
  });

  it('should parse a string into an array of args', () => {
    const argString = `${config.PROTOCOLID}:\\\\ +debug --arg0=1 --arg2 2`;
    const argSet = parser.parseArgString(argString);

    assert.equal(argSet.length, 3);
    assert.equal(argSet[0], '+debug');
    assert.equal(argSet[1], '--arg0=1');
    assert.equal(argSet[2], '--arg2 2');
  });

  it('should return EMPTY string if there are no args', () => {
    let argString = `${config.PROTOCOLID}:\\\\`;
    let argSet = parser.parseArgString(argString);

    assert.equal(argSet.length, 0);

    argString = '';
    argSet = parser.parseArgString(argString);

    assert.equal(argSet.length, 0);
  });

  it('should remove args from an array by index', () => {
    const argSet = ['+debug', '--arg0=1', '--arg1=0'];
    const remSet = parser.removeArgByIndex(argSet, 1);

    assert.equal(remSet.length, 2);
    assert.equal(remSet[0], '+debug');
    assert.equal(remSet[1], '--arg1=0');
  });

  it('should not remove anything for invalid indeces', () => {
    const argSet = ['+debug', '--arg0=1', '--arg1=0'];
    const remSet = parser.removeArgByIndex(argSet, 5);

    assert.equal(remSet.length, 3);
    assert.deepEqual(remSet, argSet);
  });

  it('should merge arg sets and override the originals', () => {
    const argSetA = ['+debug', '--arg0=1', '--arg1=0'];
    const argSetB = ['+flag', '--arg0=2', '--arg1=0'];

    const merged = parser.mergeArgSets(argSetA, argSetB);

    assert.equal(merged.length, 4);
    assert.deepEqual(merged, ['+debug', '--arg0=2', '--arg1=0', '+flag']);
  });

  it('should find the index of an arg by name', () => {
    const argSet = ['+debug', '--arg0=1', '--arg1=0'];
    const index = parser.getIndex(argSet, '--arg0');

    assert.equal(index, 1);
  });

  it('should find the index of an arg by name', () => {
    const argSet = ['+debug', '--arg0=1', '--arg1=0'];
    const index = parser.getIndex(argSet, '--arg2');

    assert.equal(index, -1);
  });

  it('should parse the value of an arg from the full arg', () => {
    let value = parser.extractValue('--arg', '--arg=boom');
    assert.equal(value, 'boom');

    value = parser.extractValue('--arg', '--arg boom2');
    assert.equal(value, 'boom2');

    value = parser.extractValue('+arg', '+arg');
    assert.equal(value, 'true');
  });
});

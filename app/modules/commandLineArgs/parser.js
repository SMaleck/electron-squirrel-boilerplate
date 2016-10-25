const config = require('../config/config');

const protocolSignature = `${config.PROTOCOLID}:\\\\`;

const self = {};


// Finds the Index of the argument that comes from the protocol shortcut
self.findProtolArgIndex = (processArgs) => {
  let i;
  const max = processArgs.length;

  for (i = 0; i < max; i++) {
    if (processArgs[i].startsWith(protocolSignature)) {
      return i;
    }
  }

  return -1;
};


self.parseArgString = (argString) => {
  if (!argString || argString === '') { return []; }

  const indices = getArgIndices(argString);
  const parsedArgs = extractArgsFromString(argString, indices.starts, indices.ends);

  return cleanWhitespace(parsedArgs);
};


// Returns a new array without the specified index
self.removeArgByIndex = (set, index) => {
  let i;
  const max = set.length;
  const result = [];

  for (i = 0; i < max; i++) {
    if (i !== index) {
      result.push(set[i]);
    }
  }

  return result;
};


// Merges two arg arrays, setB overrides setA if duplicates are found
self.mergeArgSets = (originals, overrides) => {
  const overrideArgNames = getArgNames(overrides);
  let foundIndex = -1;
  let i;
  const max = overrideArgNames.length;


  for (i = 0; i < max; i++) {
    foundIndex = self.getIndex(originals, overrideArgNames[i]);

    // Override existing arg or add new one
    if (foundIndex >= 0) {
      originals[i] = overrides[i];
    }
    else {
      originals.push(overrides[i]);
    }
  }

  return originals;
};


self.getIndex = (argSet, name) => {
  let i;
  const max = argSet.length;

  for (i = 0; i < max; i++) {
    if (isMatch(name, argSet[i])) {
      return i;
    }
  }

  return -1;
};


// Parses the arg for its value, removes leading/trailing spaces and '='
// If there is no explicit value returns 'true' for flag existence
self.extractValue = (name, fullArg) => {
  let value;

  if (!fullArg) { return null; }

  // Return 'true' for flag existence
  if (fullArg.length === name.length) { return 'true'; }

  value = fullArg.substring(name.length, fullArg.length + 1);
  value = value.trim();
  value = value.startsWith('=') ? value.substring(1, value.length + 1) : value;

  return value;
};


// -----------------------------------------------------------------------+
// Argument String Parsing Helper

// Checks the string for start and end indices of arguments
function getArgIndices(argString) {
  let i;
  const max = argString.length;
  const starts = [];
  const ends = [];

  for (i = 0; i < max; i++) {
    if (isArgStart(i, argString)) {
      starts.push(i);

      if (starts.length > 1) {
        ends.push(i);
      }
    }
  }

  // Add the end of the string as an argument end as well
  if (starts.length > 0) {
    ends.push(argString.length + 1);
  }

  return {
    starts,
    ends
  };
}


// Check if the string's position is the start of an argument
function isArgStart(index, argString) {
  // Grab the last index of the String
  const lastIndex = argString.length - 1;

  // Checks if the char at index is a Flag prefix
  if (argString[index] === '+') {
    return true;
  }

  // If this is the 2nd to last char in the string, then there can be no arg anymore
  if (lastIndex < index + 1) {
    return false;
  }

  // Check if the char at index and the next together are the dash prefix
  return (argString[index] + argString[index + 1]) === '--';
}


// Based on the start and end indices, it extracts the substrings for the arguments
function extractArgsFromString(argString, starts, ends) {
  let i;
  const max = starts.length;
  const result = [];

  if (starts.length !== ends.length) {
    return result;
  }

  for (i = 0; i < max; i++) {
    result.push(argString.substring(starts[i], ends[i]));
  }

  return result;
}


// Goes through the array and cleans out whitespace
function cleanWhitespace(argSet) {
  let i;
  const max = argSet.length;

  for (i = 0; i < max; i++) {
    argSet[i] = argSet[i].trim();
  }

  return argSet;
}


// -----------------------------------------------------------------------+
// Private Helpers

// Gets all argument names from an array of args
function getArgNames(argSet) {
  const result = [];

  argSet.forEach((elem) => {
    result.push(parseArgName(elem));
  });

  return result;
}


// Gets the argument name from the argument string
function parseArgName(argString) {
  let tempArr = [];

  if (argString === '') {
    return '';
  }

  tempArr = argString.split(' ');
  tempArr = tempArr[0].split('=');

  return tempArr[0];
}


function isMatch(expected, actual) {
  if (!actual.startsWith(expected)) {
    return false;
  }

  if (actual.length > expected.length) {
    return (actual[expected.length] === ' ' || actual[expected.length] === '=');
  }

  return expected === actual;
}

module.exports = self;

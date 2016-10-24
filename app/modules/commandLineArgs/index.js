const cache = require('./cache');
const parser = require('./parser');

let finalArgs;

const self = {};

// Expose Cahce module
self.cache = cache;


self.init = (processArgs) => {
  // The first argument is always the electron startup path
  finalArgs = parser.removeArgByIndex(processArgs, 0);

  // Attempt to find the argument string from the protocol shortcut
  const pArgIndex = parser.findProtolArgIndex(processArgs);
  let protocolArgs = [];

  // Add args from prototcol string if any were found
  if (pArgIndex >= 0) {
    finalArgs = parser.removeArgByIndex(finalArgs, pArgIndex);
    protocolArgs = parser.parseArgString(processArgs[pArgIndex]);

    finalArgs = parser.mergeArgSets(finalArgs, protocolArgs);
  }
};


self.getAllArguments = () => {
  return finalArgs;
};


self.getArgument = (name) => {
  const index = parser.getIndex(finalArgs, name);

  if (index >= 0) {
    return finalArgs[index];
  }

  return null;
};


self.getArgumentValue = (name) => {
  const arg = self.getArgument(name);

  return parser.extractValue(arg);
};


module.exports = self;

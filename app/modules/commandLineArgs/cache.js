const path = require('path');
const fs = require('fs');

const argCacheFilename = 'cache.args';

const self = {};

// Caches current arguments into a local file
self.cacheToFile = () => {
  const filename = getArgCacheFilePath();
  const argCache = JSON.stringify(process.argv);

  try {
    fs.writeFileSync(filename, argCache);
    Log(`ArgCache: Stored arguments cache to [${filename}]`);
  }
  catch (error) {
    Log(`ArgCache: ERROR - Failed to write arguments cache to [${filename}]`);
    Log(error.message);
  }
};


// Restore Argument Cache from file
self.restoreCache = () => {
  const filename = getArgCacheFilePath();
  let loaded;
  let argCache;

  Log(`ArgCache: Reading Cache from ${filename}`);

  try {
    // Check if file exists and read it
    fs.accessSync(filename);
    loaded = fs.readFileSync(filename);

    Log(`ArgCache: Loaded cache [${loaded}]`);

    // Wipe cache after reading it
    wipeArgumentCache();

    // Return current args if the cache was empty
    if (!loaded || loaded === '' || loaded === '""') {
      Log('ArgCache: Cache is empty, using process args');
      return process.argv;
    }

    // Parse the JSON and retun it
    argCache = JSON.parse(loaded);

    return argCache;
  }
  catch (error) {
    // If anything failed, return current args
    Log('ArgCache: Failed to load or parse cache, using process args');
    Log(error.message);
    return process.argv;
  }
};

// Get the full filenpath path
function getArgCacheFilePath() {
  return path.resolve(path.dirname(process.execPath), '..', argCacheFilename);
}


// Deletes the argument cache file
function wipeArgumentCache() {
  const filename = getArgCacheFilePath();
  Log('ArgCache: Wiping last cache');

  try {
    fs.writeFileSync(filename, '');
  }
  catch (error) {
    // if file is not writeable do nothing
  }
}

module.exports = self;

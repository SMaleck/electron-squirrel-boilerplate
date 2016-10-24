/*------------------------------------------------
* SQUIRREL COMMAND EVENT HANDLER
------------------------------------------------*/

const config = require('../config/config');
const clArgs = require('../commandLineArgs');

const path = require('path');
const childProcess = require('child_process');
const app = require('electron').app;


const squirrelSignature = '--squirrel';


// Get and evaluate the Squirrel command
module.exports.handleEvents = function handleEvents() {
  // Do not proceed if on DEV or OSX
  if (config.DEV || process.platform === 'darwin') {
    return false;
  }

  // Get squirrel command and resolve it to an action
  const command = getSquirrelCommand(process.argv);
  const action = resolveCommandToAction(command);

  Log(`SquirrelHandler: Received Command   [${command}]`);
  Log(`SquirrelHandler: Resolved to Action [${action}]`);

  switch (action) {

    case 'run':
      Log('SquirrelHandler: Running Update.exe and exiting');
      runUpdate();
      return true;

    case 'quit':
      Log('SquirrelHandler: Exiting');
      delayedQuit();
      return true;

    case 'noop':
      Log('SquirrelHandler: No action needed');
      return false;

    default:
      Log('SquirrelHandler: No command');
      return false;
  }
};


// Run the squirrel update executable
// Grabs all arguments and forwards them to the updated exe
function runUpdate() {
  const updateExe = getUpdateExe();

  // clean args and cache them for the restart
  removeSquirrelCommand();
  clArgs.cache.cacheToFile();

  childProcess.spawn(updateExe, [], { detached: true })
    .on('close', delayedQuit);
}


// ------------------------------------------------------+

// Get the Squirrel Command
function getSquirrelCommand(argV) {
  let i;
  const max = argV.length;

  for (i = 0; i < max; i++) {
    if (argV[i].startsWith(squirrelSignature)) {
      return argV[i];
    }
  }

  return '';
}


// Removes the Squirrel Command from command line args
// This is run before caching the args for next run to avoid infinte squirrel restarts
function removeSquirrelCommand() {
  const result = [];

  process.argv.forEach((processArg) => {
    if (processArg.startsWith(squirrelSignature) === false) {
      result.push(processArg);
    }
  });

  // Override arguments with cleaned set
  process.argv = result;
}


// Evaluates the squirrel command into an actionable command
// this is a utility, because we do not take complex actions here and this reduces code repetition
function resolveCommandToAction(command) {
  switch (command.toLowerCase()) {

    case '--squirrel-firstrun':
      return 'quit';

    case '--squirrel-install':
      return 'quit';

    case '--squirrel-updated':
      return 'run';

    case '--squirrel-uninstall':
      return 'quit';

    case '--squirrel-obsolete':
      return 'quit';

    default:
      return 'noop';
  }
}


// Get the updater path
function getUpdateExe() {
  return path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
}


// Quits the application with a short delay, so logging can occur
function delayedQuit() {
  setTimeout(app.quit, 500);
}

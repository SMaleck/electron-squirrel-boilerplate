'use strict';

var mockHelper = require('../mocks/mockHelper');
var mockery = require('mockery');
var assert = require('assert');

var config;
var mockAutoUpdater;

var updateHandler;

var originalPlatform;

// -----------------------------------------------------------+
describe('UPDATE HANDLER:', function () {
  // -----------------------------------------------------------+

  before(function () {
    mockHelper.start();

    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');
    mockery.registerSubstitute('../utilities/argCache', '../../../test/mocks/argCache.mock');

    config = require('../../app/modules/config/config');
    mockAutoUpdater = require('../mocks/electron.mock').autoUpdater;

    updateHandler = require('../../app/modules/update/updateHandler');

    // redefine process.platform
    originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
  });

  beforeEach(function () {
    mockAutoUpdater.didQuitAndInstall = false;
  });

  after(function () {
    mockHelper.shutdown();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    });
  });

  it('Added all Listeners on Require', function () {
    assert(mockAutoUpdater.listeners.hasOwnProperty('checking_for_update'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('update_available'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('update_not_available'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('update_downloaded'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('error'));
  });


  it('Does nothing on CHECKING FOR UPDATE', function () {
    var check = 0;
    setTimeout(function () {
      check = 1;
      mockAutoUpdater.listeners.checking_for_update();
      setTimeout(function () {
        check = 2;
        mockAutoUpdater.listeners.update_not_available();
      }, 5);
    }, 5);

    return updateHandler()
      .then(function () {
        assert.equal(check, 2);
      })
      .catch(function () {
        assert(false);
      });
  });


  it('Does nothing on UPDATE AVAILABLE', function () {
    var check = 0;
    setTimeout(function () {
      check = 1;
      mockAutoUpdater.listeners.update_available();
      setTimeout(function () {
        check = 2;
        mockAutoUpdater.listeners.update_not_available();
      }, 5);
    }, 5);

    return updateHandler()
      .then(function () {
        assert.equal(check, 2);
      })
      .catch(function () {
        assert(false);
      });
  });

  it('Resolves on UPDATE NOT AVAILABLE', function () {
    setTimeout(function () {
      mockAutoUpdater.listeners.update_not_available();
    }, 5);

    return updateHandler()
      .then(function () {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(function () {
        assert(false);
      });
  });


  it('Rejects on UPDATE DOWNLOADED', function () {
    setTimeout(function () {
      mockAutoUpdater.listeners.update_downloaded();
    }, 5);

    return updateHandler()
      .then(function () {
        assert(false);
      })
      .catch(function () {
        assert(mockAutoUpdater.didQuitAndInstall);
      });
  });


  it('Resolves on ERROR', function () {
    setTimeout(function () {
      mockAutoUpdater.listeners.error({ message: 'nothing' });
    }, 5);

    return updateHandler()
      .then(function () {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(function () {
        assert(false);
      });
  });


  it('Resolves on DEV Environment', function () {
    config.DEV = true;

    return updateHandler()
      .then(function () {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(function () {
        assert(false);
      });
  });


  it('Resolves on OSX Platform', function () {
    config.DEV = false;
    Object.defineProperty(process, 'platform', {
      value: 'darwin'
    });

    return updateHandler()
      .then(function () {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(function () {
        assert(false);
      });
  });
});

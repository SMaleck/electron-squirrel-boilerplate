const mockHelper = require('../mocks/mockHelper');
const mockery = require('mockery');
const assert = require('assert');

let config;
let mockAutoUpdater;

let updateHandler;

const originalPlatform = process.platform;

// -----------------------------------------------------------+
describe('UPDATE HANDLER:', () => {
  // -----------------------------------------------------------+

  before(() => {
    mockHelper.start();

    mockery.registerSubstitute('electron', '../../../test/mocks/electron.mock');
    mockery.registerSubstitute('../utilities/argCache', '../../../test/mocks/argCache.mock');

    config = require('../../app/modules/config/config');
    mockAutoUpdater = require('../mocks/electron.mock').autoUpdater;

    updateHandler = require('../../app/modules/update/updateHandler');

    // redefine process.platform
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
  });

  beforeEach(() => {
    mockAutoUpdater.didQuitAndInstall = false;
  });

  after(() => {
    mockHelper.shutdown();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    });
  });

  it('Added all Listeners on Require', () => {
    assert(mockAutoUpdater.listeners.hasOwnProperty('checking_for_update'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('update_available'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('update_not_available'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('update_downloaded'));
    assert(mockAutoUpdater.listeners.hasOwnProperty('error'));
  });


  it('Does nothing on CHECKING FOR UPDATE', () => {
    let check = 0;
    setTimeout(() => {
      check = 1;
      mockAutoUpdater.listeners.checking_for_update();
      setTimeout(() => {
        check = 2;
        mockAutoUpdater.listeners.update_not_available();
      }, 5);
    }, 5);

    return updateHandler()
      .then(() => {
        assert.equal(check, 2);
      })
      .catch(() => {
        assert(false);
      });
  });


  it('Does nothing on UPDATE AVAILABLE', () => {
    let check = 0;
    setTimeout(() => {
      check = 1;
      mockAutoUpdater.listeners.update_available();
      setTimeout(() => {
        check = 2;
        mockAutoUpdater.listeners.update_not_available();
      }, 5);
    }, 5);

    return updateHandler()
      .then(() => {
        assert.equal(check, 2);
      })
      .catch(() => {
        assert(false);
      });
  });

  it('Resolves on UPDATE NOT AVAILABLE', () => {
    setTimeout(() => {
      mockAutoUpdater.listeners.update_not_available();
    }, 5);

    return updateHandler()
      .then(() => {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(() => {
        assert(false);
      });
  });


  it('Rejects on UPDATE DOWNLOADED', () => {
    setTimeout(() => {
      mockAutoUpdater.listeners.update_downloaded();
    }, 5);

    return updateHandler()
      .then(() => {
        assert(false, 'Should not continue');
      })
      .catch(() => {
        assert(mockAutoUpdater.didQuitAndInstall);
      });
  });


  it('Resolves on ERROR', () => {
    setTimeout(() => {
      mockAutoUpdater.listeners.error({ message: 'nothing' });
    }, 5);

    return updateHandler()
      .then(() => {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(() => {
        assert(false);
      });
  });


  it('Resolves on DEV Environment', () => {
    config.DEV = true;

    return updateHandler()
      .then(() => {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(() => {
        assert(false);
      });
  });


  it('Resolves on OSX Platform', () => {
    config.DEV = false;
    Object.defineProperty(process, 'platform', {
      value: 'darwin'
    });

    return updateHandler()
      .then(() => {
        assert(mockAutoUpdater.didQuitAndInstall === false);
      })
      .catch(() => {
        assert(false);
      });
  });
});

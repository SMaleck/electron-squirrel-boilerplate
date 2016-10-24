'use strict';

// -----------------------------------------------------------+
describe('Windows Compatibility Polyfills', function () {
  // -----------------------------------------------------------+
  it('Add process.env', function () {
    process = process || {};
    process.env = process.env || {};
    process.argv = process.argv || [];
  });

  it('Add string.startsWith()', function () {
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
      };
    }
  });

  it('Add string.endsWith()', function () {
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
          position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      };
    }
  });
});

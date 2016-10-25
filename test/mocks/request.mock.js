/*-----------------------------------
* MOCK MODULE
-----------------------------------*/

var error = '';
var response = { status: 200 };
var body = '';
var lastURL = '';

module.exports = function (req, callback, mochaOverride) {
  if (mochaOverride) {
    if (mochaOverride.get) {
      return lastURL;
    }

    error = mochaOverride.error;
    response.status = mochaOverride.responseStatus;
    body = mochaOverride.body;
    return;
  }

  lastURL = req ? req.url : lastURL;
  if (typeof callback === 'function') { callback(error, response, body); }
};

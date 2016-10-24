/*-----------------------------------
* MOCK MODULE
-----------------------------------*/

'use strict';

var self = {};

self.run = function run() {
  return new Promise(function (resolve, reject) {
    self.resolve = resolve;
    self.reject = reject;
  });
};

self.initApp = self.run;

self.resolve = function resolve() {};
self.reject = function reject() {};

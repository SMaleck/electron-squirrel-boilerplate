/*-----------------------------------
* MOCK MODULE
-----------------------------------*/

const self = {};

self.run = function run() {
  return new Promise((resolve, reject) => {
    self.resolve = resolve;
    self.reject = reject;
  });
};

self.initApp = self.run;

self.resolve = function resolve() {};
self.reject = function reject() {};

'use strict';

let Request = require('./models').Request;
let co = require('co');


exports.save = function(request) {
  return co(function *() {
    console.log('savieng request db');
    console.log(request);
    let requestToSave = new Request(request);
    let result = yield requestToSave.save();
    return result
  });
};
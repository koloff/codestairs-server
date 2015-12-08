'use strict';

let co = require('co');
let Resource = require('./models').Resource;


exports.save = function(resource) {
    return co(function *() {
      let resourceToSave = new Resource(resource);
      yield resourceToSave.save();
    });
};

exports.search = function (phrase) {
  return co(function *() {

    let result = yield Resource.find(
      { $text : { $search : phrase } },
      { score : { $meta: "textScore" } })
    .sort({ score : { $meta : 'textScore' } })
    .exec();

    return result;
  });
};
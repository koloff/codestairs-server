'use strict';

let co = require('co');
let Course = require('./models').Course;

exports.create = function(course) {
  return co(function *() {
    let courseToSave = new Course(course);
    yield courseToSave.save();
  });
};

exports.search = function(phrase) {
  return co(function *() {
    let result = yield Course.find(
      { $text : { $search : phrase } },
      { score : { $meta: "textScore" } })
      .sort({ score : { $meta : 'textScore' } })
      .exec();

    return result;
  });
};
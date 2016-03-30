'use strict';

let Request = require('./models').Request;
let co = require('co');

exports.getById = function(id) {
  return co(function *() {
    return yield Request.findOne({'_id': id});
  });
};

exports.save = function(request, authorId) {
  return co(function *() {
    request.author = authorId;
    let requestToSave = new Request(request);
    let result = yield requestToSave.save();
    return result;
  });
};

exports.getMultiple = function(options) {

  let period = options.period | 0;
  let criteria = options.criteria;
  let start = options.start | 0;
  let count = options.count | 0;


  return co(function *() {
    let result = yield Request
      .find()
      .where('dateAdded').gte(new Date().getTime() - 1000 * 60 * 60 * period)
      .sort(`${criteria === 'most-liked' ? '-rating.value' : '-dateAdded'}`)
      .skip(start)
      .limit(count)
      .populate('author', 'username')
      .exec();

    console.log(result);

    console.log('result');
    return result;
  });

};


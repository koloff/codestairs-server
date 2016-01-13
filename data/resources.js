'use strict';

let co = require('co');
let extractor = require('./../utils/extractor');
let Resource = require('./models').Resource;
let _ = require('lodash');


exports.save = function(resource) {
  return co(function *() {
    let resourceToSave = new Resource(resource);
    return yield resourceToSave.save();
  });
};

exports.getMultiple = function(start, count) {
  return co(function *() {
    let startPos = start | 0;
    let howMany = count | 0;

    if (start < 0 || start > 999 || count < 0 || count > 999) {
      throw 'INVALID_ARGUMENTS';
    }

    let resources = yield Resource
      .find()
      .sort('-dateAdded')
      .skip(startPos)
      .limit(howMany)
      .exec();

    let shortened = _.pluck(resources, 'short');
    
    return shortened;
  });
};

exports.search = function(phrase) {
  return co(function *() {

    let result = yield Resource.find({
        $text: {$search: phrase}
      }, {
        score: {$meta: "textScore"}
      })
      .sort({score: {$meta: 'textScore'}})
      .select('url type humanLanguage title dateAdded screenshotFile')
      .exec();

    return result;
  });
};

exports.findById = function(id) {

  return co(function *() {
    let result = yield Resource.findOne({_id: id}).exec();
    return result;
  });

};

exports.findByIds = function(ids) {
  console.log('finding by ids');
  return co(function *() {
    let result = yield Resource.find({
        '_id': {$in: ids}
      })
      .exec();

    console.log('resultttttttt');

    return result;
  });
};

exports.findByUrl = function(url) {

  return co(function *() {
    // shorten the url
    let urlToSearch = extractor.shortenUrl(url);
    let resource = yield Resource.findOne({url: urlToSearch}).exec();
    if (resource) {
      resource = resource.short;
    }
    return resource;
  });

};
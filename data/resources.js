'use strict';

let co = require('co');
let extractor = require('./../utils/extractor');
let Resource = require('./models').Resource;


exports.save = function(resource) {
  return co(function *() {
    let resourceToSave = new Resource(resource);
    return yield resourceToSave.save();
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
'use strict';
let co = require('co');
let extractor = require('../utils/extractor');
let entries = require('../data/entries');


exports.save = function(req, res) {
  co(function *() {

    console.log(req.params);
    console.log(req.body);

    try {
    	let entry = yield extractor.extract(req.body.url);

      console.dir(entry);

      yield entries.save(entry);

    } catch(err) {
      console.log(err);
    }

  });
};
'use strict';
let co = require('co');
let resources = require('../data/resources');
let courses = require('../data/courses');

exports.search = function(req, res) {
  let searchType = req.params.searchType;
  let phrase;

  if (req.query && req.query.phrase) {
    phrase = req.query.phrase;

    // different type of search

    if (searchType === 'resource') {
      co(function *() {
        try {
        	let result = yield resources.search(phrase);
          console.log('Resources search completed!');
          res.status(200).send(result);
        } catch(err) {
          res.status(400).end();
        }
      });
    } else {
      // invalid search type
      res.send(400).send({
        reason: 'INVALID_SEARCHTYPE'
      });
    }

  } else {
    res.status(400).send({
      error: true,
      reason: 'NO_PHRASE'
    });
  }
};



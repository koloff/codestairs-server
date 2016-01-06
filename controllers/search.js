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

    if (searchType === 'resources') {
      co(function *() {
        try {
          let result = yield resources.search(phrase);
          console.log('Resources search completed!');
          console.log(result);
          res.status(200).send(result);
        } catch (err) {
          console.log(err);
          console.log('error');
          res.status(400).send(err).end();
        }
      });
    } else if (searchType == 'courses') {
      co(function *() {
        try {
          console.log('searching courses...');
          let result = yield courses.search(phrase);
          console.log('Courses search completed!');
          console.log(result);
          res.status(200).send(result);
        } catch (err) {
          console.log(err);
          res.status(400).send(err).end();
        }
      });
    } else {
      // invalid search type
      console.log('INVALID_SEARCHTYPE');
      res.status(400).send({
        reason: 'INVALID_SEARCHTYPE'
      });
    }

  } else {
    console.log('NO_PHRASE');
    res.status(400).send({
      error: true,
      reason: 'NO_PHRASE'
    });
  }
};



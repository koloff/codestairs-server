'use strict';
let co = require('co');
let paths = require('../data/paths');
let requests = require('../data/requests');

exports.search = function(req, res) {
  let searchType = req.params.searchType;
  let phrase;

  if (req.query && req.query.phrase) {
    phrase = req.query.phrase;

    // different type of search

    if (searchType === 'paths') {
      co(function *() {
        try {
          let result = yield paths.search(phrase);
          console.log('Paths search completed!');
          console.log(result);
          res.status(200).send(result);
        } catch (err) {
          console.log(err);
          console.log('error');
          res.status(400).send(err).end();
        }
      });
    } else if (searchType == 'requests') {
      co(function *() {
        try {
          let result = yield requests.search(phrase);
          console.log('Requests search completed!');
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
    res.status(404).send({
      error: true,
      reason: 'NO_PHRASE'
    });
  }
};



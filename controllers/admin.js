'use strict';
let co = require('co');
let paths = require('../data/paths');
let requests = require('../data/requests');


exports.deleteEntry = function(req, res) {
  console.log(req.body);
  
  co(function *() {
    if (req.body.count) {
      if (req.body.type === 'paths') {
        co(function *() {
          yield paths.deleteLatest(req.body.count | 0);
        });
      } else if (req.body.type === 'requests') {
        co(function *() {
          yield requests.deleteLatest(req.body.count | 0);
        });
      }
    } else if (req.body.regularExpression) {
      if (req.body.type === 'paths') {
        co(function *() {
          yield paths.deleteByRegex(req.body.field);
        });
      } else if (req.body.type === 'requests') {
        co(function *() {
          yield requests.deleteByRegex(req.body.field);
        });
      }
    }
    res.status(200).send({ok: true});
  }).catch((err) => {
    console.log(err);
    res.status(500).send({error: err});
  });

};
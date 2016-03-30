'use strict';
let co = require('co');
let requests = require('../data/requests');

exports.save = function(req, res) {
  co(function *() {
    try {
      let result = yield requests.save(req.body.requestData, req.userId);
      res.status(200).send(result);
    } catch(err) {
      console.log(err);
      res.status(403).send({REASON: 'INVALID_DATA'})
    }
  });
};


exports.getById = function(req, res) {
  co(function *() {
    try {
      let result = yield requests.getById(req.params.id);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      if (err === 'INVALID_ARGUMENTS') {
        res.status(400).send({reason: err}).end();
      }

      res.status(500).send({reason: err}).end();
    }
  }).catch(err => console.log(err));
};

exports.getMultiple = function(req, res) {
  co(function *() {
    try {
      let result = yield requests.getMultiple(req.query);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      if (err === 'INVALID_ARGUMENTS') {
        res.status(400).send({reason: err}).end();
      }

      res.status(500).send({reason: err}).end();
    }
  }).catch(err => console.log(err));
};

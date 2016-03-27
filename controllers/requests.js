'use strict';
let co = require('co');
let requests = require('../data/requests');
let shortid = require('shortid');

exports.save = function(req, res) {
  co(function *() {
    try {
      let result = yield requests.save(req.body.requestData);
      res.status(200).send(result);
    } catch(err) {
      console.log(err);
      res.status(403).send({REASON: 'INVALID_DATA'})
    }
  });
};
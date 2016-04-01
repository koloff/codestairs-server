'use strict';

let co = require('co');
let social = require('../data/social');

exports.commentEntity = function (req, res) {
  console.log('commenting entity');
  
  co(function *() {
    try {
      let result = yield social.comment(req.userId, req.params.entityId, req.body.comment);
      res.status(200).send(result);
    } catch(err) {
      console.log(err);
      res.status(500).end();
    }
  });
};

exports.rateEntity = function (req, res) {
  console.log('rating entity');
  console.log(req.body);
  console.log(req.params);

  co(function *() {
    try {
      let result = yield social.rate(req.userId, req.params.entityId, req.body.value);
      console.log(result);
      res.status(200).send(result);
    } catch(err) {
      console.log(err);
      res.status(500).end();
    }
  });
};
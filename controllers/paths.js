'use strict';
let co = require('co');
let paths = require('../data/paths');
let shortid = require('shortid');

exports.save = function(req, res) {
  console.log('saving path controller...');
  let path = req.body;

  if (!shortid.isValid(path._id)) {
    res.send(400).send({reason: 'FAKE_ID'});
    return;
  }
  if (!shortid.isValid(path.editId)) {
    res.send(400).send({reason: 'FAKE_EDITID'});
    return;
  }

  co(function *() {
    try {
      let savedPath = yield paths.save(path);
      console.log('path created');
      res.status(200).send({
        ok: true,
        path: savedPath
      });
    } catch (err) {
      console.log('Error in creating path controller:');
      console.log(err);
      if (err.errors && err.errors.title) {
        res.status(500).send({reason: 'NO_TITLE'});
      }
      res.status(500).send({reason: 'CANNOT_SAVE'});
    }
  });
};


exports.getMultiple = function(req, res) {
  co(function *() {
    try {
      let result = yield paths.getMultiple(req.query);
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

exports.getById = function(req, res) {
  co(function *() {
    try {
      let result = yield paths.getSingle('_id', req.params.id);
      console.log(result);
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

exports.getByEditId = function(req, res) {
  co(function *() {
    try {
      let result = yield paths.getSingle('editId', req.params.editId);
      console.log(result);
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


exports.rate = function(req, res) {
  co(function *() {
    try {
      console.log(req.userId);
      console.log(req.body);

      let result = yield paths.rate(req.userId, req.params.pathId, req.body.value);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  });
};


exports.addResource = function(req, res) {
  co(function *() {
    try {
      console.log(req.body);
      let result = yield paths.addResource(req.params.editId, req.body);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  });
};

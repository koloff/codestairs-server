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
      let result = yield paths.getMultiple(req.query.start, req.query.count);
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


//
//function getMultiple(req, res) {
//  co(function *() {
//    try {
//      let result = yield paths.getMultiple(req.query.start, req.query.count);
//      console.log(result);
//      res.status(200).send(result);
//    } catch(err) {
//      console.log(err);
//      if (err === 'INVALID_ARGUMENTS') {
//        res.status(400).send({reason: err}).end();
//      }
//
//      res.status(500).send({reason: err}).end();
//    }
//  }).catch(err => console.log(err));
//}
//
//function getOne(req, res) {
//  co(function *() {
//    try {
//      let result = yield paths.getSingle(req.query.start, req.query.count);
//      console.log(result);
//      res.status(200).send(result);
//    } catch(err) {
//      console.log(err);
//      if (err === 'INVALID_ARGUMENTS') {
//        res.status(400).send({reason: err}).end();
//      }
//
//      res.status(500).send({reason: err}).end();
//    }
//  }).catch(err => console.log(err));
//}
//
//exports.getPaths = function(req, res) {
//  if (req.query.byWhat) {
//    getOne(req, res);
//  } else if (req.query.start || req.query.count) {
//    getMultiple(req, res);
//  }
//
//  else {
//    res.status(400).send({reason: 'INVALID_QUERY'});
//  }
//};


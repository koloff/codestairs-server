'use strict';
let co = require('co');
let courses = require('../data/courses');

exports.create = function(req, res) {
  let course = req.body;

  co(function *() {
    try {
      courses.create(course);
      console.log('Course created');
      res.status(200).send({
        ok: true
      });
    } catch (err) {
      console.log('Error in creating course controller: ' + err);
    }
  });
};

'use strict';
let co = require('co');
let courses = require('../data/courses');

exports.save = function(req, res) {
  console.log('saving course controller...');
  let course = req.body;

  co(function *() {
    try {
      let savedCourse = yield courses.save(course);
      console.log('Course created');
      res.status(200).send({
        ok: true,
        course: savedCourse
      });
    } catch (err) {
      console.log('Error in creating course controller:');
      console.log(err);
      res.status(500).send({reason: 'CANNOT_SAVE'});
    }
  });
};

exports.insertResources = function(req, res) {

  // test resource: 5687eece782df6cc21503a83 ruby 2015
  // test course: 5687ef1f782df6cc21503a84 petkan, dragan

  co(function *() {
    let courseId = req.params.courseId;
    let resourcesIds = req.body.resourcesIds;
    try {
      yield courses.insertResources(courseId, resourcesIds);
      console.log('Resources added!');
      res.status(200).send({ok: true});
    } catch(err) {
      console.log('Courses insert resources error from controller:');
      console.log(err);
    }
  });

};


function getMultiple(req, res) {
  co(function *() {
    try {
      let result = yield courses.getMultiple(req.query.start, req.query.count);
      console.log(result);
      res.status(200).send(result);
    } catch(err) {
      console.log(err);
      if (err === 'INVALID_ARGUMENTS') {
        res.status(400).send({reason: err}).end();
      }

      res.status(500).send({reason: err}).end();
    }
  }).catch(err => console.log(err));
}

exports.getCourses = function(req, res) {
  if (req.query._id) {
    //getById(req, res);
  } else if (req.query.start || req.query.count) {
    getMultiple(req, res);
  }

  else {
    res.status(400).send({reason: 'INVALID_QUERY'});
  }
};
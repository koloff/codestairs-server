'use strict';

let router = require('express').Router();
let resourcesController = require('../controllers/resources');
let coursesController = require('../controllers/courses');
let searchController = require('../controllers/search');

router.route('/resources')
  .post(resourcesController.save);

router.route('/courses')
  .post(coursesController.save);

router.route('/courses/:courseId')
  .post(coursesController.insertResources); //todo

router.route('/search/:searchType')
  .get(searchController.search);


module.exports = router;
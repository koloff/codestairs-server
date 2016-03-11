'use strict';

let router = require('express').Router();
let authController = require('../controllers/auth');
let usersController = require('../controllers/users');
let resourcesController = require('../controllers/resources');
let coursesController = require('../controllers/courses');
let searchController = require('../controllers/search');

let pathsController = require('../controllers/paths');

router.route('/login')
  .post(authController.login);

router.route('/users')
  .post(usersController.save);

router.route('/resources')
  .get(resourcesController.getResources)
  .post(resourcesController.save);

router.route('/courses')
  .get(coursesController.getCourses)
  .post(coursesController.save);

router.route('/paths')
  .get(pathsController.getMultiple)
  .post(pathsController.save);

router.route('/paths/:id')
  .get(pathsController.getById);

router.route('/paths/edit/:editId')
  .get(pathsController.getByEditId);

router.route('/courses/:courseId')
  .post(coursesController.insertResources); //todo

router.route('/rate/course/:courseId')
  .post(authController.authenticate(), coursesController.rate);

router.route('/search/:searchType')
  .get(searchController.search);



module.exports = router;
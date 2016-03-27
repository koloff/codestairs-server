'use strict';

let router = require('express').Router();
let authController = require('../controllers/auth');
let usersController = require('../controllers/users');
let resourcesController = require('../controllers/resources');
let requestsController = require('../controllers/requests');

let pathsController = require('../controllers/paths');

router.route('/login')
  .post(authController.login);

router.route('/users')
  .post(usersController.save);

router.route('/resources')
  .get(resourcesController.getResources)
  .post(resourcesController.save);

router.route('/paths')
  .get(pathsController.getMultiple)
  .post(pathsController.save);

router.route('/paths/:id')
  .get(pathsController.getById);

router.route('/paths/edit/:editId')
  .get(pathsController.getByEditId);

router.route('/rate/path/:pathId')
  .post(authController.authenticate(), pathsController.rate);

router.route('/requests')
  .post(authController.authenticate(), requestsController.save);

module.exports = router;
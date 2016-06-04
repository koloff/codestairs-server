'use strict';

let router = require('express').Router();
let authController = require('../controllers/auth');
let usersController = require('../controllers/users');
let socialController = require('../controllers/social');
let resourcesController = require('../controllers/resources');
let requestsController = require('../controllers/requests');
let searchController = require('../controllers/search');
let adminController = require('../controllers/admin');

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

router.route('/search/:searchType')
  .get(searchController.search);

router.route('/paths/:id')
  .get(pathsController.getById);

router.route('/paths/edit/:editId')
  .get(pathsController.getByEditId)
  .put(resourcesController.save, pathsController.addResource);

router.route('/requests')
  .post(authController.authenticate(), requestsController.save)
  .get(requestsController.getMultiple);

router.route('/requests/:id')
  .get(requestsController.getById);

router.route('/rate/:entityId')
  .post(authController.authenticate(), socialController.rateEntity);

router.route('/comment/:entityId')
  .post(authController.authenticate(), socialController.commentEntity);

router.route('/admin/delete')
  .delete(authController.authenticate('admin'), adminController.deleteEntry);


module.exports = router;
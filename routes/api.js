'use strict';

let router = require('express').Router();
let entriesController = require('../controllers/entries');


router.route('/entries')
  .post(entriesController.save);


module.exports = router;
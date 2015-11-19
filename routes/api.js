"use strict";

let router = require('express').Router();
let controller = require('../controllers/entries');


router.route('/entries')
  .get(controller.getEntry);


module.exports = router;
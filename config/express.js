'use strict';
let express = require('express');
let morgan = require('morgan');
let helmet = require('helmet');
let bodyParser = require('body-parser');

module.exports = function (app, routes) {

  // allows CORS
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });

  // adds security
  app.use(helmet());

  // logs requests
  app.use(morgan('dev'));

  app.use('/static', express.static(__dirname + '/../static'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // use the api routes
  app.use('/api/v1', routes);

  // if no route is matched return 404
  app.use((req, res) => {
    res.status(404).end();
  });
};
'use strict';
let express = require('express');
let path = require('path');
let subdomain = require('express-subdomain');
let morgan = require('morgan');
let helmet = require('helmet');
let bodyParser = require('body-parser');

module.exports = function(app, routes) {

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


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));


  // use the api routes
  app.use(subdomain('api', routes));

  app.use('/static', express.static(path.join(__dirname + '/../static')));
  app.use('/generated', express.static(path.join(__dirname + '/../generated')));

  app.get('/*', function(req, res) {
    res.status(200).sendFile(path.join(__dirname + '/../static/index.html'));
  });

  // if no route is matched return 404
  app.use((req, res) => {
    res.status(404).end();
  });
};
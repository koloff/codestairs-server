'use strict';
let morgan = require('morgan');
let bodyParser = require('body-parser');

module.exports = function (app, routes) {

  //app.use(morgan('dev'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));


  // use the api routes
  app.use('/api/v1', routes);

  // if no route is matched return 404
  app.use((req, res) => {
    res.status(404).end();
  });
};
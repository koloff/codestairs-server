'use strict';
let mongoose = require('mongoose');

module.exports = function(config) {

  mongoose.connect(config.db);
  var db = mongoose.connection;

  db.once('open', function(err) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Database running');
  });

  db.on('error', function(err) {
    console.log('Database error: ' + err);
  });
  
};

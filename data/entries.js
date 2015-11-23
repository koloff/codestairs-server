'use strict';

let co = require('co');
let Entry = require('./models').Entry;


exports.save = function(entry) {

  co(function *() {

    try {
      let entry = new Entry(entry);
      yield entry.save();
    } catch(err) {
      console.log(err);
    }

  });

};



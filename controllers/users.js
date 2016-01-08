'use strict';
let co = require('co');
let users = require('../data/users');

exports.save = function(req, res) {
  let user = req.body;
  console.log(user);
  co(function *() {
    try {
      let savedUser = yield users.save(user);
      console.log('saved user:');
      console.log(savedUser);
      res.status(200).send({
        token: savedUser.token,
        profile: savedUser.profile
      });
    } catch(err) {

      console.log(err);

      if (err === 'EMAIL_TAKEN') {
        res.status(400).send({reason: 'EMAIL_TAKEN'}).end();
      }
      else if (err === 'USERNAME_TAKEN') {
        res.status(400).send({reason: 'USERNAME_TAKEN'}).end();
      } else {
        res.status(500).send({
          reason: 'ERROR'
        });
      }

    }
  });
};
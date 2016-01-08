'use strict';
let co = require('co');
let encryption = require('../utils/encryption');
let config = require('../config/config');
let token = require('../utils/token');
let users = require('../data/users');


function validateUser(username, password) {
  return co(function *() {
    let user = yield users.findBy('username', username);
    if (user && user.password === encryption.generateHashedPassword(password, user.salt)) {
      return user;
    } else {
      return false;
    }
  });
}


exports.login = function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    res.status(403).send({reason: 'INVALID_CREDENTIALS'}).end();
  }

  co(function *() {
    try {
    	let user = yield validateUser(username, password);
      console.log(user);
      if (user) {
        res.status(200).send({
          token: user.token,
          profile: user.profile
        });
      } else {
        res.status(403).send({reason: 'INVALID_CREDENTIALS'});
      }

    } catch(err) {
      console.log(err.trace);
      res.status(500).send(err);
    }
  });
};

exports.authenticate = function(role) {
  return function(req, res, next) {

    // We skip the token auth for [OPTIONS] requests.
    if(req.method === 'OPTIONS') next();

    let token;
    if (req.body && req.body.token) {
      token = req.body.token;
    } else if (req.query && req.query.token) {
      token = req.query.token;
    } else if (req. headers && req.headers['x-access-token']) {
      token = req.headers['x-token'];
    }

    if (accessToken) {
      try {
        // can throw exceptions
        var decodedToken = token.decode(token);

        if (!role || (role && (decodedToken.roles && decodedToken.roles.indexOf(role) > -1))) {
          req.userId = decodedToken.userId;
          next();
        } else {
          res.status(403).send({reason: 'NOT_AUTHORISED'}).end();
        }

      } catch (ex) {
        res.status(403).send({reason: 'INVALID_TOKEN'}).end();
      }
    } else {
      res.status(403).send({reason: 'INVALID_TOKEN'}).end();
    }
  };

};
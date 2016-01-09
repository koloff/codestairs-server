'use strict';

let jwt = require('jwt-simple');
let config = require('../config/config');

exports.decode = function(token) {
  return jwt.decode(token, config.secret);
};

exports.generate = function(user) {

  let token = jwt.encode({
    userId: user._id,
    roles: user.roles
  }, config.secret);

  return token;
};
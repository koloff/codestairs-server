'use strict';

let jwt = require('jwt-simple');
let config = require('../config/config');

exports.decode = function(token) {
  let result = jwt.decode(token, config.secret);
  return result;
};

exports.generate = function(user) {

  let token = jwt.encode({
    userId: user._id,
    roles: user.roles
  }, config.secret);

  return token;
};
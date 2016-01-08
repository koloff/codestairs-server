'use strict';
let crypto = require('crypto');

module.exports = {

  generateSalt: function() {
    return crypto.randomBytes(128).toString('base64');
  },

  generateHashedPassword: function(pwd, salt) {
    let hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
  }

};
'use strict';
let env = process.env.NODE_ENV || 'development';

let config = {};

config.diffbotToken = '0ab4f90aeb230e9fd4a827d61430d488';

config.port = env.port || 3377;
config.db = env.db || 'mongodb://localhost/codestairs';

module.exports = config;

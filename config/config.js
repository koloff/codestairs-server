'use strict';
let env = process.env.NODE_ENV || 'development';

let config = {};

config.diffbotToken = '1de74bd0e4d1733fc7c343c58746127c';

config.port = env.port || 3377;
config.db = env.db || 'mongodb://localhost/codestairs';

module.exports = config;

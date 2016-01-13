'use strict';
let path = require('path');
let env = process.env || 'development';

let config = {};

config.diffbotToken = '1de74bd0e4d1733fc7c343c58746127c';

config.port = env.port || 3377;
config.db = env.db || 'mongodb://localhost/codestairs';
config.secret = env.secret || 'johncena';
config.generatedDir = path.resolve(__dirname + './../generated');


module.exports = config;

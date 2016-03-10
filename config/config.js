'use strict';
let path = require('path');
let env = process.env || 'development';

let config = {};

config.diffbotToken = '8ec1e7600797b5e85f5c484094bd6f2e';

config.port = env.port || 3377;
config.db = env.db || 'mongodb://localhost/codestairs';
config.secret = env.secret || 'johncena';
config.generatedDir = path.resolve(__dirname + './../generated');


module.exports = config;

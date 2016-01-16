'use strict';
let path = require('path');
let env = process.env || 'development';

let config = {};

config.diffbotToken = '8165c3f96112eafc42acabd7046fef0c';

config.port = env.port || 3377;
config.db = env.db || 'mongodb://localhost/codestairs';
config.secret = env.secret || 'johncena';
config.generatedDir = path.resolve(__dirname + './../generated');


module.exports = config;

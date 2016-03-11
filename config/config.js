'use strict';
let path = require('path');
let env = process.env || 'development';

let config = {};

config.diffbotToken = '75ed683d89300b4b7eb73ff7e877e715';

config.port = env.port || 3377;
config.db = env.db || 'mongodb://localhost/codestairs';
config.secret = env.secret || 'johncena';
config.generatedDir = path.resolve(__dirname + './../generated');


module.exports = config;

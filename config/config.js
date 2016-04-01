'use strict';
let path = require('path');
let env = process.env.NODE_ENV || 'production';

console.log(env);

let settings;
if (env === 'development') {
  settings ={
    "diffbotToken": "75ed683d89300b4b7eb73ff7e877e715",
    "port": 3377,
    "db": "mongodb://localhost/codestairs",
    "secret": "johncena"
  }
} else {
  settings = require('./SETTINGS.json');
}

let config = {};

config.generatedDir = path.resolve(__dirname + './../generated');

config.diffbotToken = settings.diffbotToken;

config.port = env.port || settings.port;
config.db = env.db || settings.db;
config.secret = env.secret || settings.secret;


module.exports = config;

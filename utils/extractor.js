'use strict';
let token = require('../config/config').diffbotToken;

let request = require('superagent');

let diffBotUrl = 'http://api.diffbot.com/v3/analyze';

exports.extract = function(entryUrl) {

  let promise = new Promise((resolve, reject) => {
    request
      .get(diffBotUrl)
      .query({
        token: token,
        url: entryUrl
      })
      .end(function (err, res){
        if (err) {
          reject(err);
        }

        resolve(res.body);
      });
  });

  return promise;
};
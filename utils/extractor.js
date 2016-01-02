'use strict';
let webshot = require('webshot');
let token = require('../config/config').diffbotToken;

let request = require('superagent');

let diffBotUrl = 'http://api.diffbot.com/v3/analyze';

/**
 * Gets url and extract page content
 * @param entryUrl Page for crawling
 * @returns {Promise} Returns the extracted data
 */
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

/**
 * Gets url and returns promise with screenshot of the page
 * @param url URL of the page
 * @param locationOfImage Where the image to be saved
 * @return {Promise}
 */
exports.getScreenshot = function(url, locationOfImage){

  // screenshot options
  let options = {
    quality: 50
  };

  let promise = new Promise((resolve, reject) => {
    webshot(url, locationOfImage, options, function(err) {
      if (err) {
        return reject(err);
      }

      resolve(true);
    });
  });

  return promise;
};
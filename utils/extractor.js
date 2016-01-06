'use strict';
let webshot = require('webshot');
let token = require('../config/config').diffbotToken;

let request = require('superagent');

const diffBotUrl = 'http://api.diffbot.com/v3/analyze';


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

/**
 * Get url and remove protocol, 'www.' and '/' in the end
 * @param url
 * @returns {String}
 */
exports.shortenUrl = function(url) {

  if (!url) {
    return '';
  }

  let shortened = url;

  // remove protocol
  let protocolPos = url.indexOf('://');
  if (protocolPos !== -1) {
    let protocolPosEnd = protocolPos + 3;
    shortened = url.slice(protocolPosEnd, url.length);
  }

  // remove www if available
  let wwwPos = shortened.indexOf('www.');
  if (wwwPos !== -1 && shortened.slice(0, 3) === 'www') {
    let wwwPosEnd = wwwPos + 4;
    shortened = shortened.slice(wwwPosEnd, shortened.length);
  }

  // remove the slash in the end if available
  if (shortened[shortened.length - 1] === '/') {
    shortened = shortened.slice(0, shortened.length - 1);
  }

  return shortened;
};
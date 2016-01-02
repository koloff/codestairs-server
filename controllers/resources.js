'use strict';
let co = require('co');
let fs = require('fs');
let extractor = require('../utils/extractor');
let resources = require('../data/resources');

/**
 * gets resource url, title and description then analyze and save in db
 * @param req Body contains {url, title, description}
 * @param res
 */
exports.save = function(req, res) {
  co(function *() {

    // should contain {url, title, description}
    let options = req.body;


    // webshot only saves the image to the disk, will look for workaround in the future
    const imgDirectory = 'tmp/img.jpg';

    // parallel extraction of the page data and getting a screenshot
    let result;
    try {
      result = yield {
        // get the extracted data
        extractedPage: extractor.extract(options.url),
        // extract image and save it in the directory
        imgPromise: extractor.getScreenshot(options.url, imgDirectory)
      }
    } catch (err) {
      console.log(err);
      res.status(400).end();
    }
    // after the parallel execution get the extracted page data
    let extractedPage = result.extractedPage;


    if (extractedPage) {
      console.log('PAGE EXTRACTED');

      // selects the required fields
      let data = extractedPage.objects[0];
      console.log(extractedPage);

      // get the page screenshot
      let img = fs.readFileSync(imgDirectory);

      // prepare for save
      let resource = {
        url: data.pageUrl,
        type: extractedPage.type,
        humanLanguage: extractedPage.humanLanguage,
        title: options.title || data.title,
        titleExtracted: data.title || null,
        tags: data.tags,
        html: data.html,
        text: data.text,
        screenshot: {
          data: img,
          contentType: 'image/jpg'
        }
      };

      // save in db
      try {
        let savedResource = yield resources.save(resource);
        //console.log(savedResource);
        console.log('Resource saved!');
        res.status(200).send({ok: true});
      } catch (err) {
        console.log('Resource saving err');
        console.log(err);
      }
    }

  });
};
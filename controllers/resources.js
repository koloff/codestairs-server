'use strict';
let path = require('path');
let co = require('co');
let uuid = require('node-uuid');
let extractor = require('../utils/extractor');
let resources = require('../data/resources');
let config = require('../config/config');


/**
 * gets resource url, title and description then analyze and save in db
 * @param req Body contains {url, title, description}
 * @param res
 */
exports.save = function(req, res) {
  co(function *() {

    // should contain {url, title, description}
    let options = req.body;
    console.log(req.body);


    // check if resource is already added
    let alreadySaved = yield resources.findByUrl(req.body.url);
    if (alreadySaved) {
      res.status(200).send({
        ok: true,
        resource: alreadySaved
      });
      return;
    }

    // create name and specifies the directory for the resource's screenshot
    let randomImgName = uuid.v4();
    console.log(randomImgName);
    let imgDirectory = path.resolve(config.generatedDir + '/screenshots/' + randomImgName + '.jpg');
    console.log(imgDirectory);

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
      // most likely the url is invalid
      console.log(err);
      res.status(400).send({reason: 'INVALID_URL'}).end();
    }

    // after the parallel execution get the extracted page data
    let extractedPage = result.extractedPage;

    if (extractedPage) {
      console.log('PAGE EXTRACTED');
      //console.log(extractedPage);

      // get shortened url
      let shortenedUrl = extractor.shortenUrl(options.url);

      // available to all extracted
      let resource = {
        url: shortenedUrl,
        type: extractedPage.type,
        humanLanguage: extractedPage.humanLanguage,
        screenshotFile: randomImgName + '.jpg',
        title: extractedPage.title || shortenedUrl
      };

      // available only to successfully fully analyzed
      let analyzedData = extractedPage.objects[0];
      if (analyzedData) {
        resource.title = analyzedData.title;
        resource.tags = analyzedData.tags;
        resource.html = analyzedData.html;
        resource.text = analyzedData.text;
      }

      // save in db
      try {
        let savedResource = yield resources.save(resource);
        console.log('Resource saved!');
        if (savedResource) {
          savedResource = savedResource.short;
        }

        res.status(200).send({
          resource: savedResource,
          ok: true
        });
      } catch (err) {
        console.log('Resource saving err');
        console.log(err);
        res.status(500).send({
          ok: false,
          reason: 'ERROR'
        })
      }
    }

  }).catch((err) => {
    res.status(500).send({reason: 'ERROR'});
    console.log(err.stack);
  });
};

exports.getResources = function(req, res) {
  if (req.query.id) {
    getById(req, res);
  } else if (req.query.url) {
    getByUrl(req, res);
  } else if (req.query.start || req.query.count) {
    getMultiple(req, res);
  }

  else {
    res.status(400).send({reason: 'INVALID_QUERY'});
  }
};

function getMultiple(req, res) {
  co(function *() {
    try {
      let result = yield resources.getMultiple(req.query.start, req.query.count);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      if (err === 'INVALID_ARGUMENTS') {
        res.status(400).send({reason: err}).end();
      }

      res.status(500).send({reason: err}).end();
    }
  }).catch(err => console.log(err));
}

function getById(req, res) {
  co(function *() {
    try {
      let resource = yield resources.findById(req.query.id);
      res.send(resource.short);
    } catch (err) {
      console.log(err);
      res.send(500).send(err);
    }
  });
}

function getByUrl(req, res) {
  co(function *() {
    try {
      let resource = yield resources.findByUrl(req.query.url);
      console.log('finding by url..');
      console.log(resource);
      res.send(resource);
    } catch (err) {
      console.error(err + err.stack);
      res.status(500).send(err);
    }
  });
}
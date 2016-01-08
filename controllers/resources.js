'use strict';
let co = require('co');
let uuid = require('node-uuid');
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
    console.log(req.body);


    // create name and specifies the directory for the resource's screenshot
    let randomImgName = uuid.v4();
    console.log(randomImgName);
    let imgDirectory = `static/images/resources-screenshots/${randomImgName}.jpg`;

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
      console.log('extractor errorrrr');
      console.log(err);
      res.status(400).send({reason: 'INVALID_URL'}).end();
    }
    // after the parallel execution get the extracted page data
    let extractedPage = result.extractedPage;


    if (extractedPage) {
      console.log('PAGE EXTRACTED');
      console.log(extractedPage);

      // get shortened url
      let shortenedUrl = extractor.shortenUrl(options.url);

      // prepare for save
      let resource;

      // available to all extracted
      resource = {
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
        console.log('screenshot:');
        console.log(savedResource.screenshot);
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

        if (err.code == 11000) {
          res.status(400).send({
            ok: false,
            reason: 'DUPLICATE_RESOURCE'
          });
        }
      }
    }

  }).catch((err) => {
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
      console.log(result);
      res.status(200).send(result);
    } catch(err) {
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
      let resource = yield resources.findById(req.params.id);
      res.send(resource);
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
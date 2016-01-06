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
      console.log('extractor error');
      console.log(err);
      res.status(400).end();
    }
    // after the parallel execution get the extracted page data
    let extractedPage = result.extractedPage;


    if (extractedPage) {
      console.log('PAGE EXTRACTED');

      console.log(extractedPage);

      // selects the required fields
      let data = extractedPage.objects[0];

      // the page cannot be fully extracted
      if (!data) {
        res.status(404).send({reason: 'CANNOT_EXTRACT'});
        res.end();
      }

      // get shortened url
      let shortenedUrl = extractor.shortenUrl(data.pageUrl);

      // prepare for save
      let resource = {
        url: shortenedUrl,
        type: extractedPage.type,
        humanLanguage: extractedPage.humanLanguage,
        title: data.title || shortenedUrl,
        tags: data.tags,
        html: data.html,
        text: data.text,
        screenshotFile: randomImgName + '.jpg'
      };

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

exports.getResource = function(req, res) {
  if (req.query._id) {
    getById(req, res);
  } else if (req.query.url) {
    getByUrl(req, res);
  } else {
    res.status(400).send({reason: 'INVALID_RESOURCE'});
  }
};

function getById(req, res) {
  co(function *() {
    try {
      let resource = yield resources.findById(req.params._id);
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
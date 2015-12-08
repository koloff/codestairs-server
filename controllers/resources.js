'use strict';
let co = require('co');
let extractor = require('../utils/extractor');
let resources = require('../data/resources');


exports.save = function(req, res) {
  co(function *() {
    let extracted = yield extractor.extract(req.body.url);
    if (extracted) {
      console.log(extracted);
    }
    if (extracted) {
      // save in the db
      let data = extracted.objects[0];
      let resource = {
        url: data.pageUrl,
        type: extracted.type,
        humanLanguage: extracted.humanLanguage,
        title: data.title,
        tags: data.tags,
        html: data.html,
        text: data.text
      };
      console.log(resource.tags);

      try {
        yield resources.save(resource);
        console.log('Resource saved!');
        res.status(200).send({ok: true});
      } catch(err) {
        console.log('Resource saving err');
      	console.log(err);
      }
    }
  });
};
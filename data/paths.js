'use strict';

let co = require('co');
let _ = require('lodash');
let resources = require('./resources');
let Path = require('./models').Path;
let users = require('./users');
let extractor = require('./../utils/extractor');

// todo
exports.save = function(path) {
  return co(function *() {
    console.log('path:');
    console.log(path);
    let courseToSave = new Path(path);
    let saved = yield courseToSave.save();
    return saved;
  });
};

exports.getSingle = function(byWhat, identifier) {
  let query = {};
  query[byWhat] = identifier;


  // todo remove editId
  return co(function *() {
    let result = yield Path
      .findOne(query)
      .populate('resources.extracted', '-text -html')
      .exec();
    return result;
  });
};

exports.getMultiple = function(options) {

  let period = options.period | 0;
  let criteria = options.criteria;
  let start = options.start | 0;
  let count = options.count | 0;
  console.log(options);




  return co(function *() {
    let result = yield Path
      .find()
      .where('dateAdded').gte(new Date().getTime() - 1000 * 60 * 60 * period) //
      .sort(`${criteria === 'most-liked' ? '-rating.value' : '-dateAdded'}`)
      .skip(start)
      .limit(count)
      .exec();

    console.log(result);

    console.log('result');
    return result;

  });
};

/**
 * Search for courses by first by their own title and description
 * then looks for resources which meets the search condition
 * in the end combines and sorts the results
 * @param phrase
 * @returns {*|Promise}
 */
exports.search = function(phrase) {
  console.log(phrase);
  return co(function *() {

    //  search for courses based on their own data
    let getPathsByDataAsync = Path.find(
      {$text: {$search: phrase}},
      {score: {$meta: "textScore"}})
      .sort({score: {$meta: 'textScore'}})
      .exec();


    // find resources that answer the query
    let getResourcesAsync = resources.search(phrase);

    // run the above operations async in parallel
    let res = yield {
      getPathsByDataAsync,
      getResourcesAsync
    };

    // retrieve the information from the queries
    let pathsByData = res.getPathsByDataAsync;
    let foundResources = res.getResourcesAsync;

    let resourcesIds = _.pluck(foundResources, '_id');

    let pathsByResources = [];
    console.log(resourcesIds);
    if (resourcesIds.length > 0) {
      // look for courses that contain some of the found resources
      pathsByResources = yield Path.find({
          'resources.extracted': {$in: resourcesIds}
        })
        .exec();
    }


    //join te results and remove duplicates
    let union = _(_.union(pathsByData, pathsByResources))
      .uniq(item => item.id)
      .value();

    console.log(union);

    return union;

  }).catch((err) => {
    console.log(err.stack);
    throw err;
  });
};


exports.addResource = function(pathEditId, extractedData, specifiedData) {
  return co(function *() {
    console.log('specified data');
    console.log(specifiedData);
    let resourceToPush = {
      extracted: extractedData._id,
      title: specifiedData.title || specifiedData.url,
      description: specifiedData.description,
      duration: specifiedData.duration,
      difficulty: specifiedData.difficulty
    };
    console.log('resource to push');
    console.log(resourceToPush);
    let path = yield Path.update({editId: pathEditId}, {
      $push: {
        'resources': resourceToPush
      }
    });

    console.log('path saved');
    console.log(path);
  });
};


exports.deleteLatest = function(count) {
  return co(function *() {
    try {

      let docs = yield Path.find({})
        .sort({dateAdded: -1})
        .limit(count)
        .exec();

      let removedIdsArray = docs
        .map(function(doc) {
          return doc._id;
        });

      yield Path.remove({_id: {$in: removedIdsArray}})

    } catch (err) {
      console.log(err);
    }

  });
};
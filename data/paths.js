'use strict';

let co = require('co');
let _ = require('lodash');
let resources = require('./resources');
let Path = require('./models').Path;

// todo
exports.save = function(course) {
  return co(function *() {
    console.log('course:');
    console.log(course);
    let courseToSave = new Path(course);
    let saved = yield courseToSave.save();
    return saved;
  });
};

exports.getSingle= function(byWhat, identifier) {
  console.log('getting single');
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

exports.getMultiple = function(start, count) {
  return co(function *() {
    let startPos = start | 0;
    let howMany = count | 0;

    if (start < 0 || start > 999 || count < 0 || count > 999) {
      throw 'INVALID_ARGUMENTS';
    }

    let paths = yield Path
      .find()
      .sort('-dateAdded')
      .skip(startPos)
      .limit(howMany)
      .exec();

    console.log(paths);

    return paths;
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
      .populate('resources', '-text -html -tags')
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

    //console.log('coursesByData');
    //console.log(coursesByData);
    //console.log('coursesByResources');
    //console.log(coursesByResources);

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

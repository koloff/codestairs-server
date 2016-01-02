'use strict';

let co = require('co');
let resources = require('./resources');
let Course = require('./models').Course;

exports.save = function(course) {
  return co(function *() {
    let courseToSave = new Course(course);
    yield courseToSave.save();
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
    let getCoursesByDataAsync = Course.find(
      {$text: {$search: phrase}},
      {score: {$meta: "textScore"}})
      .sort({score: {$meta: 'textScore'}})
      .exec();


    // find resources that answer the query
    let getResourcesAsync = resources.search(phrase);
    // run the above operations async in parallel
    let res = yield {
      getCoursesByDataAsync,
      getResourcesAsync
    };

    // retrieve the information from the queries
    let coursesByData = res.getCoursesByDataAsync;
    let foundResources = res.getResourcesAsync;

    // get the ids of the found resources
    let resourcesIds = [];
    foundResources.map((resource) => {
      resourcesIds.push(resource._id);
    });

    let coursesByResources = [];
    if (resourcesIds.length > 0) {
      // look for courses that contain some of the found resources
      coursesByResources = yield Course.find({
        resources: {$in: [resourcesIds]}
      }).exec();
    }

    console.log('Courses by data:');
    console.log(coursesByData);
    console.log('Courses by resources');
    console.log(coursesByResources);
  });
};

exports.insertResources = function(courseId, resourcesIds) {
  return co(function *() {
    let course = yield Course.findById(courseId).exec();
    yield course.update({
      $addToSet: {
        resources: {$each: resourcesIds}
      }
    }).exec();
  });
};
'use strict';

let co = require('co');
let _ = require('lodash');
let resources = require('./resources');
let Course = require('./models').Course;

exports.save = function(course) {
  return co(function *() {
    let courseToSave = new Course(course);
    yield courseToSave.save();
  });
};

exports.findById = function(id) {
  return co(function *() {
    let result = yield Course.find(id);
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

    let courses = yield Course
      .find()
      .sort('-dateAdded')
      .skip(startPos)
      .limit(howMany)
      .populate('resources', '_id title url dateAdded humanLanguage type rating')
      .exec();

    console.log(courses);

    return courses;
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
      .populate('resources', '-text -html -tags')
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

    let resourcesIds = _.pluck(foundResources, '_id');

    let coursesByResources = [];
    console.log(resourcesIds);
    if (resourcesIds.length > 0) {
      // look for courses that contain some of the found resources
      coursesByResources = yield Course.find({
          resources: {$in: resourcesIds}
        })
        .populate('resources', '-text -html -tags')
        .exec();
    }

    //console.log('coursesByData');
    //console.log(coursesByData);
    //console.log('coursesByResources');
    //console.log(coursesByResources);

    //join te results and remove duplicates
    let union = _(_.union(coursesByData, coursesByResources))
      .uniq(item => item.id)
      .value();

    console.log(union);

    return union;

  }).catch((err) => {
    console.log(err.stack);
    throw err;
  });
};

exports.rate = function(courseId, userId, value) {
  return co(function *() {
    let updatedCourse = yield Course.findByIdAndUpdate(courseId, {
      'rating.value': value,
      $push: {
        'rating.votes' : {
          user: userId,
          value: value
        }
      }
    });

    return updatedCourse;
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
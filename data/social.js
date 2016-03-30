'use strict';
let co = require('co');
let paths = require('./paths');
let requests = require('./requests');




// function lookForCommentInAllCollections(commentId) {
//   co(function *() {
//     let result = yield {
//       pathsComment: path.findComment(commentId),
//       requestsComment: requests.findComment(commentId)
//     };
//
//     if (result.pathsComment) {
//       return result.pathsComment;
//     } else if (result.requestsComment) {
//       return result.requestsComment
//     } else {
//       return undefined;
//     }
//   });
// }

exports.rate = function(userId, entityId, value) {
  return co(function *() {

      // search for the entity in all collections that can be rated
      let path = yield paths.getSingle('_id', entityId);
      if (path) {
        let result = yield path.vote(userId, value);
        return result.rating;
      }

      let request = yield requests.getById(entityId);
      if (request) {
        let result = yield request.vote(userId, value);
        return result.rating;
      }

    }
  );
};

exports.comment = function(userId, entityId, comment) {
  return co(function *() {

      // search for the entity in all collections that can be commented
      let path = yield paths.getSingle('_id', entityId);
      if (path) {
        let result = yield path.comment(userId, comment);
        return result;
      }

      let request = yield requests.getById(entityId);
      if (request) {
        let result = yield request.comment(userId, comment);
        return result;
      }

    }
  );
};


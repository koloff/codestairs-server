'use strict';

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;
let co = require('co');
let votes = require('./votes');

let commentSchema = new mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  text: {
    type: String,
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

commentSchema.index(
  {
    text: 'text'
  }
);

commentSchema.plugin(votes);


function comments(schema, options) {

  schema.add({
    comments: [commentSchema]
  });

  schema.methods.comment = function(userId, comment) {

    let self = this;
    return co(function *() {
      self.comments.push({author: userId, text: comment});
      let result = yield self.save({'new': true});
      return result;
    });

  };

  schema.methods.findComment = function(commentId) {

    let self = this;
    return co(function *() {
      let result = yield self.find({}).exec();
      console.log(result);
    });

  };


  schema.methods.getAllComments = function() {
    let self = this;
    return co(function *() {
      let result = self.populate('comments.author', 'username');
      return result.comments;
    });
  };

}

module.exports = exports = comments;
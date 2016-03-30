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
    console.log('args');
    console.log(arguments);

    let self = this;
    return co(function *() {
      self.comments.push({author: userId, text: comment});
      return yield self.save();
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
    return this.comments;
  };

}

module.exports = exports = comments;
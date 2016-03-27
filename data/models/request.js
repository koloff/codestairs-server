'use strict';
let mongoose = require('mongoose');
let commentSchema = require('./comment');

let requestSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  knows: String,
  wantsToLearn: {
    type: String,
    required: true
  },
  availableTime: {
    type: String
  },
  comments: [{
    type: commentSchema
  }]
});

requestSchema.index(
  {
    knows: 'text',
    wantsToLearn: 'text'
  }
);


module.exports = mongoose.model('Request', requestSchema);
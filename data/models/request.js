'use strict';
let mongoose = require('mongoose');
let votes = require('./plugins/votes');
let comments = require('./plugins/comments');

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
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

requestSchema.index(
  {
    '$**': 'text'
  }
);


requestSchema.plugin(votes);
requestSchema.plugin(comments);


module.exports = mongoose.model('Request', requestSchema);
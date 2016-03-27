'use strict';
let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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


module.exports = mongoose.model('Comment', commentSchema);
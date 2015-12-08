'use strict';
let mongoose = require('mongoose');

let courseSchema = new mongoose.Schema({
  length: {
    type: Number
  },
  title: {
    type: String,
    required: true
  },
  tags: Array,
  description: {
    type: String
  },
  resources: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

courseSchema.index(
  {title: 'text'},
  {descripton: 'text'}
);


module.exports = mongoose.model('Course', courseSchema);
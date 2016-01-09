'use strict';
let mongoose = require('mongoose');
let ratingSchema = require('./rating');

let courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  resources: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}]
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  rating: {type: ratingSchema, default: ratingSchema}
});

courseSchema.index({
  title: 'text',
  description: 'text'
});


module.exports = mongoose.model('Course', courseSchema);
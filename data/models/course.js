'use strict';
let mongoose = require('mongoose');

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
  }
});

courseSchema.index({
  title: 'text',
  description: 'text'
});


module.exports = mongoose.model('Course', courseSchema);
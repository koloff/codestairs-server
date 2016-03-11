'use strict';
let mongoose = require('mongoose');
let shortid = require('shortid');

let pathSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  editId: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  difficulty: String,
  duration: String,
  resources: [{
    extracted: {type: mongoose.Schema.Types.ObjectId, ref: 'Resource'},
    title: String,
    description: String,
    difficulty: String,
    duration: String
  }],
  dateAdded: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0
  }
});

pathSchema.index({
  title: 'text',
  description: 'text',
  resources: 'text'
});


module.exports = mongoose.model('Path', pathSchema);
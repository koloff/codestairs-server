'use strict';
let mongoose = require('mongoose');
let shortid = require('shortid');
let votes = require('./plugins/votes');

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
  }
});

pathSchema.index({
  dateAdded: -1,
  '$**': 'text'
});


pathSchema.plugin(votes);


module.exports = mongoose.model('Path', pathSchema);
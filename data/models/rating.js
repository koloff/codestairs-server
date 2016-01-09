'use strict';
let mongoose = require('mongoose');
let _ = require('lodash');

let ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 0
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  }]
});


module.exports = ratingSchema;
'use strict';
let mongoose = require('mongoose');

let entrySchema = new mongoose.Schema({
  url: {
    type: String,
    regexp: new RegExp('/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/'),
    required: true
  },
  type: {
    type: String
  },
  humanLanguage: {
    type: String
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5
  },
  length: {
    type: Number
  },
  title: {
    type: String,
    required: true
  },
  tags: [Object],
  description: {
    type: String
  }
});


module.exports = mongoose.model('Entry', entrySchema);
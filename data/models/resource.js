'use strict';
let mongoose = require('mongoose');

let resourceSchema = new mongoose.Schema({
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
  titleExtracted: {
    type: String
  },
  text: String,
  html: String,
  tags: Array,
  description: {
    type: String
  },
  screenshot: {
    data: Buffer,
    contentType: String
  }
});

resourceSchema.index(
  {
    title: 'text',
    titleExtracted: 'text',
    description: 'text',
    text: 'text'
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
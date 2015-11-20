"use strict";
let mongoose = require('mongoose');

let entrySchema = new mongoose.Schema({
  url: {
    type: String,
    regexp: new RegExp('/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/'),
    required: true
  },
  title: {
    type: String,
    required: true
  },
  keywords: [{
    type: String,
    max: 99
  }],
  description: {
    type: String
  }
});

module.exports = entrySchema;
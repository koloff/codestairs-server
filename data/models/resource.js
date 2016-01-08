'use strict';
let mongoose = require('mongoose');

let resourceSchema = new mongoose.Schema({

  // shortened  -  no protocol, 'www.' or '/' in the end (in order to be unique)
  url: {
    type: String,
    // the regex passes not shortened - will fix in the future
    regexp: new RegExp('/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/'),
    required: true,
    unique: true
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
  text: String,
  html: String,
  tags: Array,
  dateAdded: {
    type: Date,
    default: Date.now
  },
  screenshotFile: String
});

resourceSchema.index(
  {
    title: 'text',
    titleExtracted: 'text',
    description: 'text',
    text: 'text'
  }
);

resourceSchema
  .virtual('short')
  .get(function() {
    return {
      _id: this._id,
      title: this.title,
      url: this.url,
      type: this.type,
      screenshotFile: this.screenshotFile,
      dateAdded: this.dateAdded,
      rating: this.rating,
      comments: this.comments
    }
  });

module.exports = mongoose.model('Resource', resourceSchema);
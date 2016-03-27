'use strict';

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;
let co = require('co');


module.exports = exports = votes;


function votes(schema, options) {

  schema.add({
    rating: {
      value: {
        type: Number,
        default: 0
      },
      upvotes: [{type: ObjectId}],
      downvotes: [{type: ObjectId}]
    }
  });

  schema.methods.vote = function(userId, value) {
    let self = this;
    return co(function *() {
      let vote = value > 0 ? 1 : -1;

      self.rating.upvotes.pull(userId);
      self.rating.downvotes.pull(userId);

      if (vote > 0) {
        self.rating.upvotes.addToSet(userId);
      } else {
        self.rating.downvotes.addToSet(userId);
      }

      self.set({'rating.value': self.rating.upvotes.length - self.rating.downvotes.length});

      return yield self.save();
    });
  };


  schema.methods.votes = function() {
    return this.rating.value;
  };

}
'use strict';

let mongoose = require('mongoose');
let token = require('../../utils/token');
let encryption = require('../../utils/encryption');

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    regexp: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  dateRegistered: {
    type: Date,
    default: Date.now
  },
  roles: [String],
  firstName: String,
  lastName: String
});

userSchema
  .virtual('profile')
  .get(function() {
    return {
      id: this._id,
      username: this.username,
      email: this.email
    };
  });


// Execute before each user.save() call
userSchema.pre('validate', function(next) {

  console.log('presave');
  let user = this;
  console.log(user.isModified('password'));
  console.log(user.isModified('token'));


  if (user.isModified('password')) {
    let salt = encryption.generateSalt();
    let hashedPassword = encryption.generateHashedPassword(this.password, salt);
    user.password = hashedPassword;
    user.salt = salt;
  }

  if (!user.token) {
    let generatedToken = token.generate(user);
    user.token = generatedToken;
  }

  next();
});

module.exports = mongoose.model('User', userSchema);
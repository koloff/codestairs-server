'use strict';
let co = require('co');
let User = require('./models').User;

function findBy(by, value) {
  return co(function *() {
    let query = {};
    query[by] = value;

    let user = yield User.findOne(query).exec();
    return user;
  });
}

exports.findBy = findBy;

exports.save = function(userObj) {
  let userToSave = userObj;
  console.log(userObj);
  return co(function *() {
    // check if already registered exists with the same email or username
    let sameEmailUserQuery = User.findOne({'email': userToSave.email}).exec();
    let sameUsernameUserQuery = User.findOne({'username': userToSave.username}).exec();

    // execute in parallel
    let result = yield {
      sameEmailUser: sameEmailUserQuery,
      sameUsernameUser: sameUsernameUserQuery
    };

    console.log(result);


    // check for duplicates
    if (result.sameEmailUser) {
      throw 'EMAIL_TAKEN';
    }
    if (result.sameUsernameUser) {
      throw 'USERNAME_TAKEN';
    }
    // save the user
    let userModel = new User(userToSave);
    let savedUser = yield userModel.save(userToSave);
    return savedUser;

  });
};


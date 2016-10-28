
import Parse  from 'parse/node';
import faker  from 'faker';
import Common from './_common';

// TODO profileFile is required !
var createUser = function (username, password, email, nickName, statusMessage) {
  return new Promise( (resolve, reject) => {

    var user = new Parse.User();

    // Essential values
    user.set("username",    Common.notNullValue(username, faker.internet.userName())); // username
    user.set("password",    Common.notNullValue(password, "password")); // password

    // Additional values
    user.set("email",       Common.notNullValue(email, faker.internet.email()));    // email
    user.set("nickName",    Common.notNullValue(nickName, faker.name.findName()));     // nickName
    user.set("statusMessage",Common.notNullValue(statusMessage, faker.lorem.sentence()));   // statusMessage

    user.signUp(null, {
      success: function(user) {
        console.log(JSON.stringify(user, null, '\t'));
        resolve(user);
      },
      error: function(user, error) {
        console.log("Error: " + error.code + " " + error.message);
        reject(error);
      }
    });

  });
};

exports.create = async function (username, password, email, nickName, statusMessage) {
  return await createUser(username, password, email, nickName, statusMessage);
};

// data = {keyword, pageNumber, pageSize}
exports.search = function (data) {

  let limit = data.pageSize || 20; //constants.DEFAULT_PAGE_SIZE;
  let skip = ((data.pageNumber || 1) - 1) * limit;

  let usernameQuery = new Parse.Query(Parse.User);
  usernameQuery.startsWith("username", data.keyword);

  let emailQuery = new Parse.Query(Parse.User);
  emailQuery.startsWith("email", data.keyword);

  let query = Parse.Query.or(usernameQuery, emailQuery); // TODO check new ??

  if(skip > 0) query = query.skip(skip);
  query = query.limit(limit).ascending('username');

  query.find({
    success: (list) => {
      console.log(list);
    },
    error: (err) => {
      console.log(err);
    },
  });
};

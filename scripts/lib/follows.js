import Parse  from 'parse/node';
import faker  from 'faker';
import Common from './_common';
import response from './_response';

var Follows = Parse.Object.extend("Follows");

exports.create = async function (username, targetUsername) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  var params = {id: await Common.getUserId(targetUsername) };

  /** /START/ cloud code **/

  if(params.id == currentUser.id) {
    // ParseError.VALIDATION_ERROR = 142; (Error code indicating that a Cloud Code validation failed.)
    response.error( {code: 142, message: "input param ("+params.id+") is same with current user"} );
    return;
  }

  var user = new Parse.User();
  user.id = params.id;

  var follow = new Follows();
  follow.set("userFrom", currentUser);
  follow.set("userTo", user);
  follow.save()
  .then(
    (value) => { response.success(value); },
    (error) => { response.error(error); }
  );
  /** /END/ cloud code **/

};

exports.load = async function (username) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  new Parse.Query(Follows)
    .equalTo('userFrom', currentUser)
    .include('userTo')
    .find().then(
      (list) => {
        list.map(followsParseObject);
      },
      (error) => { console.log(error); }
    );
};

exports.remove = async function (username, targetUsername) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  var params = {id: await Common.getUserId(targetUsername) };

  /** /START/ cloud code **/

  if(params.id == currentUser.id) {
    // ParseError.VALIDATION_ERROR = 142; (Error code indicating that a Cloud Code validation failed.)
    response.error( {code: 142, message: "input param ("+params.id+") is same with current user"} );
    return;
  }

  var user = new Parse.User();
  user.id = params.id;

  new Parse.Query(Follows)
    .equalTo('userFrom', currentUser)
    .equalTo('userTo', user)
    .first()
    .then(
      (result) => {

        if(result) {
          result.destroy().then(
            (object)  => { response.success(object);  },
            (error)   => { response.error(error);     }
          );
        } else {
          // ParseError.OBJECT_NOT_FOUND = 101 (Error code indicating the specified object doesn't exist.)
          response.error( {code: 101, message: "object doesn't exist."} );
        }

      },
      (error) => { response.error(error); }

    );
  /** /END/ cloud code **/

};

function followsParseObject(object){
  var user = object.get('userTo');
  console.log ({
    id: object.id,
    username: user.get('username'),
    email: user.get('email'),
  });
}

import Parse    from 'parse/node';
import faker    from 'faker';
import Common   from './_common';
import response from './_response';

var Chats     = Parse.Object.extend("Chats");
var Channels  = Parse.Object.extend("Channels");

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

  var query = new Parse.Query(Channels);
  query.containsAll("users", [currentUser, user]);
  query.first().then(

    (channel) => {

      if(!channel) {
        var channels = new Channels();
        channels.addUnique("users", currentUser);
        channels.addUnique("users", user);
        return channels.save();
      }else{
        return Parse.Promise.as(channel);
      }

    },
    (error) => {

      response.error(error);

    }

  ).then(

    (channel) => {

      var queryChats = new Parse.Query(Chats);
      queryChats.equalTo("user", currentUser);
      queryChats.equalTo("channel", channel);
      queryChats.first().then(

        (chat) => {
          if(!chat){
            var chats = new Chats();
            chats.set("user", currentUser);
            chats.set("channel", channel);
            chats.save().then(
              (value) => { response.success(value); },
              (error) => { response.error(error); }
            );
          }else{
            response.success(chat);
          }
        },
        (error) => {
          response.error(error);
        }
      );

    },
    (error) => {

      response.error(error);

    }

  );

  /** /END/ cloud code **/

}

exports.load = async function (username) {

  var currentUser = new Parse.User();
  currentUser.id = await Common.getUserId(username);

  new Parse.Query(Chats)
    .equalTo('user', currentUser)
    .include('channel.users')
    .find().then(
      (list) => { response.success(value); },
      (error) => { response.error(error); }
    );

  new Parse.Query(Chats)
    .equalTo('userFrom', currentUser)
    .include('userTo')
    .find().then(
      (list) => {
        list.map(chatsParseObject);
      },
      (error) => { console.log(error); }
    );
};

// TODO 확인 할 것 !!!
function chatsParseObject(object){

  var channel = object.get("channel");
  var users = channel.get("users");

  var names = [];
  users.reduceRight(function(acc, item, index, object) {

    if (item.id === 'test1') {
      object.splice(index, 1);
    } else {
      object[index] = {
        id: item.id,
        username: item.get('username'),
        email: item.get('email'),
        nickName: item.get('nickName'),
        statusMessage: item.get('statusMessage'),
        profileFileUrl: item.get('profileFile') ? item.get('profileFile').url() : null,
      }
      names.push(item.get('username'));
    }
  }, []);

  console.log( {
    id: object.id,
    name: names.join(", "),
    users,
  } );

};

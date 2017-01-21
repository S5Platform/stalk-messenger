/**
 * Chat datas for Chats Tab
 */
import { LOADED_CHATS, ADDED_CHAT, REMOVED_CHATS, LOGGED_OUT, ADDED_USERS_IN_CHAT, UPDATED_LOADEDAT, CLEAR_CHATS } from 's5-action';

const initialState = {
  list: [],
  lastLoadedAt: null,
};

let currentUser = null; // to emit current user data into chat users of the channel.

function chats(state = initialState, action) {

  if (action.type === LOADED_CHATS) {
      currentUser = action.user; // to emit current user data into chat users of the channel.
      let list = action.list.map(_parseObjToJSON);

      return {
        list,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === ADDED_CHAT) {

    currentUser = action.user;

    let chat = _parseObjToJSON(action.chat);
    let newData = [...state.list];

    newData.unshift(chat);

    return {
      list: newData,
      lastLoadedAt: new Date(),
    };

  } else if (action.type === REMOVED_CHATS) {

      let newData = [...state.list];
      var rowId = -1;

      for( var inx = 0; rowId < 0 && inx < newData.length ; inx++ ){
        if( newData[inx].id == action.chatId ){
          rowId = inx;
        }
      }

      newData.splice(rowId, 1);

      return {
        list: newData,
        lastLoadedAt: new Date(),
      };

  } else if (action.type === LOGGED_OUT || action.type === CLEAR_CHATS ) {
    return initialState;

  } else if( action.type === ADDED_USERS_IN_CHAT ){
    currentUser = action.user;
    let chat = _parseObjToJSON(action.chat);
    let newData = [...state.list];

    var updated = false;
    for( var inx = 0; !updated && inx < newData.length; inx++ ){
      if( newData[inx].id == chat.id ){
        newData[inx] = chat;
        updated = true;
      }
    }

    return {
      list: newData,
      lastLoadedAt: new Date(),
    };
  } else if (action.type === UPDATED_LOADEDAT) {

      let newData = [...state.list];

      for( var inx = 0; rowId < 0 && inx < newData.length ; inx++ ){
        if( newData[inx].id == action.chatId ){
          newData[idx].loadedAt = action.chat.loadedAt;
          break;
        }
      }

      return {
        list: newData,
        lastLoadedAt: new Date(),
      };

  }

  return state;
}

function _parseObjToJSON(object){

  var channel = object.get("channel");
  var users = channel.get("users");
  var names = [];

  users.reduceRight(function(acc, user, index, object) {

    if (user.id === currentUser.id) {
      object.splice(index, 1);
    } else {

      var avatar = "";

      if( user.get !=undefined ){
        if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
          avatar = user.get('profileFile').url();
        }
        object[index] = {
          id: user.id,
          username: user.get('username'),
          email: user.get('email'),
          nickName: user.get('nickName'),
          avatar: avatar,
          statusMessage: user.get('statusMessage'),
        };

      } else {
        object[index] = {
          id: user.id,
          username: user.username,
          email: user.email,
          nickName: user.nickName,
          avatar: user.avatar,
          statusMessage: user.statusMessage,
        };        
      }

      names.push(user.nickName);
    }
  }, []);

  return {
    id: object.id,
    channelId: channel.id,
    createdAt: object.get("createdAt"),
    updatedAt: object.get("updatedAt"), // because of using javascript date objects instead of parse object 'object.createdAt',
    name: names.join(", "),
    uid: users.length == 1 ? users[0].id : null, // uid 이 Null 이면, Group Chat !
    users: users,
    unreadCount:0
  };

}

module.exports = chats;

/**
  * Chats, Channels
  *
  */
import Parse from 'parse/react-native';
import { SERVER_URL, APP_ID } from '../../env.js';

export const LOADED_CHATS     = 'LOADED_CHATS';
export const ADDED_CHAT       = 'ADDED_CHAT';
export const REMOVED_CHATS    = 'REMOVED_CHATS';
export const ADDED_USERS_IN_CHAT = 'ADDED_USERS_IN_CHAT';

const InteractionManager = require('InteractionManager');

const Chats = Parse.Object.extend('Chats');

function loadChannelNode (channelId) {

  return new Promise( (resolve, reject) => {

    fetch( SERVER_URL + '/node/' + APP_ID + '/' + channelId )
      .then((response) => response.json())
      .then((responseJson) => {
        if( responseJson.status == 'ok' ) {
          resolve({
            app: APP_ID,
            name: responseJson.result.server.name,
            url: responseJson.result.server.url
          });
        }else{
          console.warn(responseJson);
          reject(responseJson);
        }

      })
      .catch((error) => {
        console.warn(error);
        reject(error);
      });
  });

}

function loadChatsAsync () {

  return new Promise( (resolve, reject) => {

    var currentUser = Parse.User.current();

    new Parse.Query(Chats)
      .equalTo('user', currentUser)
      .include('channel.users')
      .descending("updatedAt")
      .find()
      .then(
        (list) => {
          resolve(list);
        },
        (err) => { console.error(error); reject(err); }
      );
  });

}

function loadChatByIdAsync (id) {

  return new Promise( (resolve, reject) => {

    new Parse.Query(Chats)
      .include('channel.users')
      .get(id, {
        success: function(chat) {
          resolve(chat);
        },
        error: function(object, error) {
          console.error(error);
          reject(error);
        }
      });
  });

}

function createChatAsync (users) {

  return new Promise( (resolve, reject) => {

    let ids = [];
    users.forEach( function(user) {
       ids.push(user.id);
    } );

    Parse.Cloud.run('chats-create', { ids }).then(
      (result) => {
        resolve(result);
      },
      (err) => { console.error(error); reject(err); }
    );
  });

}

function addUserToChat (chatId, channelId, ids) {

  return new Promise( (resolve, reject) => {

    Parse.Cloud.run('chats-add', { chatId, channelId, ids }).then(
      (result) => {
        resolve(result);
      },
      (err) => { console.error(error); reject(err); }
    );
  });

}


/**
 * Load list of all chatting channels once logined
 * @params N/A
 **/
export function loadChats() {

  return async (dispatch) => {

    var currentUser = Parse.User.current();

    var list = await loadChatsAsync();

    return dispatch({
      type: LOADED_CHATS,
      user: currentUser,
      list,
    });

  };

}

/**
 * create chatting channel
 * @params id : user.id of target user
 **/
export function createChat(users) {

  return async (dispatch, getState) => {

    var result = await createChatAsync(users);

    var chat = null;

    getState().chats.list.forEach( function(obj) {
       if( obj.id == result.id ) {
         chat = obj;
       }
    });

    if(!chat) {

      var currentUser = Parse.User.current();
      chat = await loadChatByIdAsync(result.id);

      dispatch({
        type: ADDED_CHAT,
        user: currentUser,
        chat
      });

      getState().chats.list.forEach( function(obj) {
         if( obj.id == chat.id ) {
           chat = obj;
         }
      });

    }

    let node = await loadChannelNode(chat.channelId);

    return Promise.resolve({
      chat,
      node,
    });

  };

}

/**
 * Remove(leave) chatting channel
 * @params id : user.id of target user
 **/
export function leaveChat(chatId) {

  return (dispatch, getState) => {

    return Parse.Cloud.run('chats-remove', { id: chatId }, {
      success: (result) => {

        InteractionManager.runAfterInteractions(() => {

          dispatch({
            type: REMOVED_CHATS,
            result,
            chatId
          });

          return Promise.resolve();

        });

      },
      error: (error) => {
        console.warn(error);
      }
    });
  };

}

export function addUsers(chatId, channelId, ids) {

 return async (dispatch, getState) => {

    var currentUser = Parse.User.current();
    var result = await addUserToChat(chatId, channelId, ids);

    dispatch({
      type: ADDED_USERS_IN_CHAT,
      user: currentUser,
      chat: result
    });

    var chat;
    getState().chats.list.forEach( function(obj) {
       if( obj.id == result.id ) {
         chat = obj;
       }
    });

    return Promise.resolve(chat);
 };

}

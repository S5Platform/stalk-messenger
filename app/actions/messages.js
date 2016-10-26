/**
  * Messages
  *
  */
import Parse from 'parse/react-native';
import { SERVER_URL, APP_ID } from '../../env.js';

export const MESSAGE_SIZE     = 30;
export const LATEST_MESSAGE   = "LATEST_MESSAGE";

const Messages = Parse.Object.extend('Messages');
const Channels = Parse.Object.extend('Channels');
const UploadFiles = Parse.Object.extend('UploadFiles');

/*
 * add latest message
 * @params channelId
 * @params message
 */
export function setLatestMessage(channelId, text) {
  return (dispatch) => {

    return dispatch({
      type: LATEST_MESSAGE,
      message: {
        channelId,
        text
      }
    });

  };
}

/*
 * Load messages into this channel
 * @params chat (Chat Object)
 */
export  function loadMessages(chat, datetime) {

  var isFirstLoading = datetime ? false : true;

  return async (dispatch, getState) => {

    var promiseLoadMessages = new Promise( (resolve, reject) => {

      var channel = new Channels();
      channel.id = chat.channelId;

      console.log(
        'Conditions : '+ new Date(chat.createdAt) + " ~ " + (datetime ? new Date(datetime) : new Date())
      );

      new Parse.Query(Messages)
        .equalTo("channel", channel)
        .lessThan("createdAt", datetime ? new Date(datetime) : new Date())
        .greaterThan("createdAt", new Date(chat.createdAt))
        .descending("createdAt")
        .limit(MESSAGE_SIZE)
        .find()
        .then(
          (list) => {
            resolve(list.map(fromParseObject));
          },
          (error) => {
            console.warn(error);
            reject(error);
          }
        );
    });

    var promiseChannelNode = new Promise( (resolve, reject) => {

      if(isFirstLoading){

        console.log(SERVER_URL + '/node/' + APP_ID + '/' + chat.channelId);
        fetch( SERVER_URL + '/node/' + APP_ID + '/' + chat.channelId )
          .then((response) => response.json())
          .then((responseJson) => {
            if( responseJson.status == 'ok' ) {
              resolve({
                app: APP_ID,
                name: responseJson.result.server.name,
                url: responseJson.result.server.url
              });
            }else{
              reject(responseJson);
            }

          })
          .catch((error) => {
            console.warn('RN fetch exception', error);
            reject(error);
          });

      } else {

        resolve({});

      }

    });

    var [messages, node] = await Promise.all([promiseLoadMessages, promiseChannelNode]);

    return {
      messages,
      node,
    };

  };
}

export function uploadImage(data, callback) {

  let imgBase64 = 'data:image/jpeg;base64,' + data.imgBase64;

  var fileId = data.C+"_"+Date.now();
  var parseFile = new Parse.File(fileId, { base64: imgBase64 });

  var channel = new Channels();
  channel.id = data.C;

  var user = new Parse.User();
  user.id = data.U;

  var uploadFiles = new UploadFiles();
  uploadFiles.set("channel",  channel );
  uploadFiles.set("user",     user    );
  uploadFiles.set("file",  parseFile  );

  uploadFiles.save().then(
    (result) => {
      callback( null, result.get('file').url() );
    },
    (error) => {
      console.warn(error);
      //callback( err, null );
    }
  );
}

function fromParseObject(obj){

  return {
    _id: obj.id,
    text: obj.get("message"),
    createdAt: obj.createdAt,
    user: {
      _id: obj.get("user").id
    },
    image: obj.get("image")
  };
}

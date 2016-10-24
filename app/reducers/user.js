/**
 * User Reducer.
 */

import { LOGGED_IN, LOGGED_OUT, SIGNED_UP, UPDATE_USER} from 's5-action';

const initialState = {
  isLoggedIn: false,
  id:null,
  username: null,
  email: null,
  nickName: null,
  profileFileUrl: null,
  statusMessage:null
};

function user(state = initialState, action) {

  if (action.type === LOGGED_IN || action.type === SIGNED_UP) {
    let {id, username, email, nickName, profileFileUrl, statusMessage} = fromParseObject(action.data);

    return {
      isLoggedIn: true,
      id,
      username,
      email,
      nickName,
      profileFileUrl,
      statusMessage
    };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }

  if (action.type === UPDATE_USER) {
    let data = action.data;

    var value = data['value'];
    var key = data['key'];
    state[key] = value;

    return { ...state };
  }

  return state;
}

function fromParseObject(user){

  var profileFileUrl = "";
  if( user && user.get('profileFile') != null && user.get('profileFile') != undefined ){
    profileFileUrl = user.get('profileFile').url();
  }

  return {
    id: user.id,
    username: user.get('username'),
    email: user.get('email'),
    nickName: user.get('nickName'),
    profileFileUrl: profileFileUrl,
    statusMessage: user.get('statusMessage'),
  };
}

module.exports = user;

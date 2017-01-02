/**
 * Messages Reducer
 *
 */

import { LATEST_MESSAGE, UNREAD_COUNT, LOGGED_OUT} from 's5-action';

const initialState = {
  latest: {},
  unreadCount:{}
};

function messages(state = initialState, action) {

  if (action.type === LATEST_MESSAGE) {

    const {channelId, text} = action.message;

    let newData = state.latest;
    newData[channelId] = text || '';

    return {
      ...state,
      latest: newData
    };
  } else if (action.type === UNREAD_COUNT) {
    const {channelId, count} = action.message;

    var newData = state.unreadCount;
    if ( count == 1 ){
      newData[channelId] = ( newData[channelId] || 0 ) + 1;
    } else {
      newData[channelId] = count;
    }

    return {
      ...state,
      unreadCount: newData
    };
  }

  if (action.type === LOGGED_OUT) {
    return initialState;
  }
  return state;
}

module.exports = messages;

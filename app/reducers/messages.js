/**
 * Messages Reducer
 *
 */

import { LATEST_MESSAGE, UNREAD_COUNT, LOGGED_OUT, CLEAR_CHATS} from 's5-action';

const initialState = {
  latest: {},
  unreadCount:{},
  totalUnreadCount:0,
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
    var totalUnreadCount = state.totalUnreadCount;
    if ( count == 1 ){
      newData[channelId] = ( newData[channelId] || 0 ) + 1;
      totalUnreadCount = totalUnreadCount + 1;
    } else {
      totalUnreadCount = totalUnreadCount - newData[channelId];
      newData[channelId] = count;
    }

    return {
      ...state,
      unreadCount: newData,
      totalUnreadCount: ( (totalUnreadCount < 0 ) ? 0 : totalUnreadCount ) 
    };
  }

  if (action.type === LOGGED_OUT || CLEAR_CHATS ) {
    return initialState;
  }
  return state;
}

module.exports = messages;

/**
 * Messages Reducer
 *
 */

import { LATEST_MESSAGE, LOGGED_OUT} from 's5-action';

const initialState = {
  latest: {}
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
  }
  if (action.type === LOGGED_OUT) {
    return initialState;
  }
  return state;
}

module.exports = messages;

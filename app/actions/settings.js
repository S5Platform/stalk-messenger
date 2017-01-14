export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const RESET_SETTINGS = 'RESET_SETTINGS';

/*
 * add latest message
 * @params channelId
 * @params message
 */
export function updateSetting(key, value) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_SETTINGS,
      key: key,
      value: value
    });
  }
}

export function resetSetting() {
  return (dispatch) => {
    return dispatch({
      type: RESET_SETTINGS
    });
  }
}
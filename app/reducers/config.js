/**
 * LOADED_CONFIG : Config 정보는 parse 서버에 저장되어 있는 값을 가져옮 (App 에서 저장하지 않음)
 *
 * Config 값은 http://localhost:8080/dashboard/apps/S5-trippin-mobile/config 에서 입력되어 있어야 함.
 * @flow
 */

import { LOADED_CONFIG } from 's5-action';

const initialState = {
  appLinkURL: 'http://stalk.io/messenger',
  appInvitePreviewImageURL: '',
  // TODO add more configurations from parse-server
};

function config(state = initialState, action) {

  if (action.type === LOADED_CONFIG) {
    return {
      appLinkURL: action.config.get('appLinkURL') || state.appLinkURL,
      appInvitePreviewImageURL: action.config.get('appInvitePreviewImageURL') ||
        state.appInvitePreviewImageURL,
    };
  }

  return state;
}

module.exports = config;

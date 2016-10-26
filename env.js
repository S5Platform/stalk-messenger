/**
 * 설정 파일
 *
 * @flow
 */


import { Platform } from 'react-native';

// for local test !
// HAVE TO MODIFY YOUR ENV.
var stalk_session_server_url = 'http://127.0.0.1:8080';
if ( Platform.OS === 'android' ) {
  stalk_session_server_url = 'http://10.0.3.2:8080';
}

module.exports = {
  APP_NAME: 'STALK',
  APP_ID: 'STALK',
  SERVER_URL: stalk_session_server_url,
  TEST_MODE: true,
  VERSION: 1,
  APP_IDENTIFIER_IOS: 'io.stalk.s5messenger',
  APP_IDENTIFIER_ANDROID: 'io.stalk.s5messenger',
};

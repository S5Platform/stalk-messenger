/**
 * stalk-messenger React Native App
 * @flow
 */

import { AppRegistry } from 'react-native';
import Parse from 'parse/react-native';
import messenger from './app/index';
import {SERVER_URL, APP_ID} from './env';

console.disableYellowBox = true;

// initial setting for PARSE-SERVER
Parse.initialize(APP_ID);
Parse.serverURL = `${SERVER_URL}/parse`;

AppRegistry.registerComponent('s5messenger', () => messenger);

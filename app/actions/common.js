
import {
  Platform,
  InteractionManager,
  TextInput,
} from 'react-native';

const { State: TextInputState } = TextInput;

import {
  APP_NAME,
  APP_IDENTIFIER_IOS,
  APP_IDENTIFIER_ANDROID
} from '../../env';

import Parse from 'parse/react-native';

import I18n from 'react-native-i18n';
const deviceLocale = I18n.locale;

import Translations from '@resources/i18nMessages';

I18n.fallbacks = true;
I18n.locale = deviceLocale;

I18n.translations = Translations;

export const LOADED_CONFIG = 'LOADED_CONFIG';
export const SWITCH_TAB = 'SWITCH_TAB';

export async function loadConfig() {
  const config = await Parse.Config.get();
  await InteractionManager.runAfterInteractions();
  return {
    type: LOADED_CONFIG,
    config,
  };
}

export function switchTab(tab) {
  return {
    type: SWITCH_TAB,
    tab,
  };
}

/**************************** DO NOT TRIGGERED ********************************/

export async function currentInstallation() {
  const installationId = await Parse._getInstallationId();
  return new Parse.Installation({
    installationId,
    APP_NAME,
    deviceType: Platform.OS,
    // TODO: Get this information from the app itself
    appIdentifier: Platform.OS === 'ios' ? APP_IDENTIFIER_IOS : APP_IDENTIFIER_ANDROID,
  });
}

export async function updateInstallation(updates) {
  const installation = await currentInstallation();
  await installation.save(updates);
}

/**************************** utils ********************************/

export function dismissKeyboard() {
  TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
}

const REXR_I18n = /<@[a-zA-Z0-9]+>/g;

export function I18N( key, ...params ) {

  let result = I18n.t( key );
  if(!params || params.length == 0) return result;

  let _p = result.match(REXR_I18n);
  if (_p) _p.forEach((value, i) => {

    if( !params[i] && params[i] !== 0 ){
      result = result.replace(value, '');
    } else {
      result = result.replace(value, params[i]);
    };
  });

  return result;
}

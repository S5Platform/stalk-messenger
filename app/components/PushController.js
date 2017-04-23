/**
 * TODO : HAVE TO BE IMPLEMENTED !!!!
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import { Platform, PushNotificationIOS } from 'react-native';
import Parse from 'parse/react-native';
import { ANDROID_GCM_SENDER_ID } from '../../env.js';

import { connect }    from 'react-redux';

import { updateInstallation, updateDeviceToken } from 's5-action';

import PushNotification from 'react-native-push-notification';

export default class PushController extends Component {

  componentDidMount() {
    var self = this;

    PushNotification.configure({

      // Called when Token is generated (iOS and Android)
      onRegister: function(res) {

        console.log('TOKEN for push notification => ', res);

        if( res ){
          updateInstallation({deviceToken:res.token,deviceType:res.os});
          self.props.updateDeviceToken( res.token );
        }

      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          console.log( 'NOTIFICATION:', notification );
      },

      // ANDROID ONLY: (optional) GCM Sender ID.
      senderID: ANDROID_GCM_SENDER_ID,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true, // default: true

      // - Specified if permissions (ios) and token (android and ios) will requested or not,
      // - if not, you must call PushNotificationsHandler.requestPermissions() later
      requestPermissions: false, // default: true
    });

    PushNotification.checkPermissions((result) => {

      if ( Platform.OS === 'ios' ) {
        if( !result.alert && !result.badge && !result.sound ){
          // TODO implements logics once permissions canceled.
          console.warn(' TODO implements logics once permissions canceled. ', result);

          // TODO call once 
          PushNotification.requestPermissions();
        }
      }
    })

  }

  render() {
    return null;
  }
}

function select(store) {
  return {
    user: store.user
  };
}

function actions(dispatch) {
  return {
    updateDeviceToken: (deviceToken)  => dispatch(updateDeviceToken(deviceToken))
  };
}

module.exports = connect(select, actions)(PushController);

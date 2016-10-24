/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import { Platform } from 'react-native';
import Parse from 'parse/react-native';

import PushNotification from 'react-native-push-notification';

export default class PushController extends Component {

  componentDidMount() {

    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {

        console.log('TOKEN for push notification => ', token);

        Parse._getInstallationId().then(function(id) {

          var Installation = Parse.Object.extend("_Installation");
          var query = new Parse.Query(Installation);
          query.equalTo("installationId", id);
          query.find()
            .then((installations) => {
              var installation;
              if (installations.length == 0) {
                // No previous installation object, create new one.
                installation = new Installation();
              } else {
                // Found previous one, update.
                installation = installations[0];
              }
              installation.set("channels", []);
              installation.set("deviceToken", token);
              installation.set("deviceType", "ios");
              installation.set("installationId", id);
              return installation.save()
            })
            .catch((error) => {
              console.log("Error:", error);
            });

        });

      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          console.log( 'NOTIFICATION:', notification );
      },

      // ANDROID ONLY: (optional) GCM Sender ID.
      senderID: "YOUR GCM SENDER ID",

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,


      // (optional) default: true
      // - Specified if permissions (ios) and token (android and ios) will requested or not,
      // - if not, you must call PushNotificationsHandler.requestPermissions() later
      requestPermissions: true,
    });

    PushNotification.checkPermissions((result) => {

      if ( Platform.OS === 'ios' ) {
        if( !result.alert && !result.badge && !result.sound ){
          // TODO implements logics once permissions canceled.
          console.warn(' TODO implements logics once permissions canceled. ', result);
        }
      } else {
        console.warn(' TODO implements logics once permissions canceled. ', result);
      }

    });

  }

  render() {
    return null;
  }
}

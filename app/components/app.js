/**
 * Background Modules (Push Controller, App Status Handler)
 * - Load Configuration and update Installtaion
 * - Handling App Status
 * - Load Application Navigator
 * - Load Push Controller
 * @flow
 */

import React, { Component } from 'react';
import {
  AppState,
  StyleSheet,
  StatusBar,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { loadConfig, updateInstallation } from 's5-action';
import { S5Colors } from 's5-components';
import { SERVER_URL, APP_ID, VERSION } from '../../env.js';

import AppNavigator from './navigator';
import PushController from './PushController';

import PushNotification from 'react-native-push-notification';
import SocketIO from 'react-native-socketio';

class App extends Component {

  static propTypes = {
    user: React.PropTypes.object.isRequired, // from store
    loadConfig: React.PropTypes.func.isRequired, // dispatch from actions
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // Load Configuration and update Installtaion datas into parse-server
    this.props.loadConfig();
    updateInstallation({VERSION});

    if(this.props.user.isLoggedIn) {
      this.connectBGSocket();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.disconnectBGSocket();
  }

  handleAppStateChange(currentAppState) {
    console.log('currentAppState', currentAppState);
    if (currentAppState === 'active') { // ( active, background, inactive )

      // TODO : HANDING STATUS OF APP WITH currentAppState

    }
  }

  componentWillReceiveProps(nextProps) {

    if ( !this.props.user.isLoggedIn && nextProps.user.isLoggedIn ) { // Logined
      this.connectBGSocket();
    } else if ( this.props.user.isLoggedIn && !nextProps.user.isLoggedIn ) { // Logouted
      this.disconnectBGSocket();
    }
  }

  disconnectBGSocket = () => {
    if(this.socket) {
      console.log('[BACKGROUND] DISCONNECT');
      this.socket.disconnect();
    }
  }

  connectBGSocket = () => {

    this.disconnectBGSocket();

    let self = this;

    fetch( SERVER_URL + '/node/' + APP_ID + '-BG/' + this.props.user.id )
      .then((response) => response.json())
      .then((responseJson) => {
        if( responseJson.status == 'ok' ) {

          console.log('** Connect Bacground Server ** \n', responseJson.result.server.url, {
            nsp: '/background',
            forceWebsockets: true,
            forceNew: true,
            connectParams: {
              U: self.props.user.id
            }
          });

          self.socket = new SocketIO(responseJson.result.server.url, {
            nsp: '/background',
            forceWebsockets: true,
            forceNew: true,
            connectParams: {
              U: self.props.user.id
            }
          });

          self.socket.on('connect', () => { // SOCKET CONNECTION EVENT
            self.setState({ connected: true }, () => {
              console.log('[BACKGROUND] CONNECTED');
            });
          });

          self.socket.on('backgound-message', (message) => { // MESSAGED RECEIVED
            if(message && message.length > 0) {
              console.log('[BACKGROUND] MESSAGE', message[0]);
              PushNotification.localNotification({
                message: message[0].user.name + ' : ' + message[0].text
              });
            }
          });

          self.socket.connect();

        }else{
          console.console.warn(responseJson);
        }

      })
      .catch((error) => {
        console.warn('RN fetch exception', SERVER_URL + '/node/' + APP_ID + '-BG/' + this.props.user.id , error);
      });


  }

  _renderStatusBar = () => {

    if(this.props.user.isLoggedIn) {
      return (
        <StatusBar
          translucent={true}
          backgroundColor= {S5Colors.primaryDark}
          animated={true}
          barStyle={'light-content'}
          hidden={false}
          />
      );

    }else{
      return (
        <StatusBar
          translucent={true}
          backgroundColor= {S5Colors.primaryDark}
          animated={true}
          hidden={true}
          />
      );
    }
  }

  render() {

    return (
      <View style={styles.container}>

        { this._renderStatusBar() }

        <AppNavigator />

        { this.props.user.isLoggedIn ? <PushController /> : null }

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    loadConfig: () => dispatch(loadConfig()),
  };
}

module.exports = connect(select, actions)(App);

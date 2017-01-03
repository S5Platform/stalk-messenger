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
import { loadConfig, updateInstallation, setUnreadCount } from 's5-action';
import { S5Colors, S5Alert } from 's5-components';
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

  handleAppStateChange = (currentAppState) => {
    console.log('currentAppState', currentAppState);
    if (currentAppState === 'active') { // ( active, background, inactive )

      if( this.bg_socket && this.bg_socket.isConnected ) {
      } else {
        this.connectBGSocket();
      }

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
    if(this.bg_socket) {
      console.log('[BACKGROUND] DISCONNECT');
      this.bg_socket.disconnect();
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

          self.bg_socket = new SocketIO(responseJson.result.server.url, {
            nsp: '/background',
            forceWebsockets: true,
            forceNew: true,
            connectParams: {
              U: self.props.user.id
            }
          });

          self.bg_socket.on('connect', () => { // SOCKET CONNECTION EVENT
            self.setState({ connected: true }, () => {
              console.log('[BACKGROUND] CONNECTED');
            });
          });

          self.bg_socket.on('error', () => { // SOCKET CONNECTION EVENT
            this.setState({ connected: false });
          });

          self.bg_socket.on('connect_error', (err) => { // XPUSH CONNECT ERROR EVENT
            console.warn(err);
          });

          self.bg_socket.on('backgound-message', (message) => { // MESSAGED RECEIVED
            if(message && message.length > 0) {
              console.log('[BACKGROUND] MESSAGE', message[0]);
              PushNotification.localNotification({
                message: message[0].DT.user.name + ' : ' + message[0].DT.text
              });

              this.props.setUnreadCount( message[0].DT.C, 1);
            }
          });

          self.bg_socket.connect();

        }else{
          console.console.warn(responseJson);
        }

      })
      .catch((error) => {
        console.warn('RN fetch exception', SERVER_URL + '/node/' + APP_ID + '-BG/' + this.props.user.id , error);
        this.refs['alert'].alert('error', 'Error', 'an error occured, please try again late');
      });

  }

  _renderStatusBar = () => {

    if(this.props.user.isLoggedIn) {
      return (
        <StatusBar
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

        <S5Alert ref={'alert'} />

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
    setUnreadCount: (channelId, count) =>  dispatch(setUnreadCount(channelId, count)),
  };
}

module.exports = connect(select, actions)(App);

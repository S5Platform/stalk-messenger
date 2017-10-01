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
import { loadConfig, updateInstallation, setUnreadCount, setLatestMessage, loadChats } from 's5-action';
import { S5Colors, S5Alert } from 's5-components';
import { SERVER_URL, APP_ID, VERSION } from '../../env.js';

import AppNavigator from './navigator';
import AppWithNavigationState from './navigatorV2';
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

          var connectOptions = {
            nsp: '/background',
            forceWebsockets: true,
            forceNew: true,
            connectParams: {
              U: self.props.user.id
            }
          };
          console.log(responseJson.result.server.url, connectOptions)
          self.bg_socket = new SocketIO(responseJson.result.server.url, connectOptions);

          self.bg_socket.on('connect', () => { // SOCKET CONNECTION EVENT
            self.setState({ connected: true }, () => {
              console.log('[BACKGROUND] CONNECTED', connectOptions);
            });
          });

          self.bg_socket.on('error', (err) => { // SOCKET CONNECTION EVENT
            self.setState({ connected: false });
            console.warn('[BACKGROUND] ERROR', err);
          });

          self.bg_socket.on('connect_error', (err) => { // XPUSH CONNECT ERROR EVENT
            console.warn('[BACKGROUND] CONNECT ERROR', err);
          });

          self.bg_socket.on('backgound-message', (message) => { // MESSAGED RECEIVED
            self._onReceiveMessage( message );
          });

          self.bg_socket.connect();

        }else{
          console.warn(responseJson);
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

  _onReceiveMessage = (message)=> {
    var self = this;
    if(message && message.length > 0) {

      var channel = message[0].DT.C;

      if( this.props.settings.preview ){
        PushNotification.localNotification({
          message: message[0].DT.user.nickName + ' : ' + message[0].DT.text
        });

        if( message[0].DT.user.nickName && message[0].DT.text ){
          self.refs['alert'].alert('custom', message[0].DT.user.nickName,  message[0].DT.text, message[0].DT.user.avatar );
        }
      }

      var chat;
      for( var inx in self.props.chats.list ){
        var obj = self.props.chats.list[inx];
        if( obj.channelId == channel ) {
          chat = obj;
        }
      }

      if( chat ){
        self.props.setLatestMessage( channel, message[0].DT.text );
        self.props.setUnreadCount( channel, 1);
      } else {
        this.props.loadChats().then(
          (result) => {
            self.props.setLatestMessage( channel, message[0].DT.text );
            self.props.setUnreadCount( channel, 1);
          },
          (error)=> {
          }
        );
      }

    }
  }

  _onNotificationCallback = (notification)=> {
    var self = this;
    self._onReceiveMessage(notification.payload);

    // reconnect
    if( notification.payload ){
      if( this.bg_socket && this.bg_socket.isConnected ) {
      } else {
        this.connectBGSocket();
      }
    }
  }

  render() {
    var self = this;

    return (
      <View style={styles.container}>

        { this._renderStatusBar() }

        <AppNavigator />

        { this.props.user.isLoggedIn ? <PushController onNotificationCallback={self._onNotificationCallback}/> : null }

        <S5Alert ref={'alert'} imageStyle={{width:36, height:36, borderRadius:18,marginTop:10}}/>

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
    chats: store.chats,
    settings: store.settings,
  };
}

function actions(dispatch) {
  return {
    loadConfig: () => dispatch(loadConfig()),
    setLatestMessage: (channelId, text) =>  dispatch(setLatestMessage(channelId, text)),
    setUnreadCount: (channelId, count) =>  dispatch(setUnreadCount(channelId, count)),
    loadChats: () => dispatch(loadChats()),
  };
}

module.exports = connect(select, actions)(App);

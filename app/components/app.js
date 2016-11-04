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
import { SERVER_URL, APP_ID, VERSION } from '../../env.js';

import AppNavigator from './navigator';
import PushController from './PushController';

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
      this.initBackgroundSocketConnection();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    if(this.socket) {
      console.log('[BACKGROUND] DISCONNECT');
      this.socket.disconnect();
    }
  }

  handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') { // ( active, background, inactive )
      // TODO : HANDING STATUS OF APP WITH currentAppState
    }
  }

  componentWillReceiveProps(nextProps) {

    if ( !this.props.user.isLoggedIn && nextProps.user.isLoggedIn ) {
      this.initBackgroundSocketConnection();
    }
  }

  initBackgroundSocketConnection = () => {

    if(this.socket) { this.socket = null; }

    let self = this;

    fetch( SERVER_URL + '/node/' + APP_ID + '-BG/' + this.props.user.id )
      .then((response) => response.json())
      .then((responseJson) => {
        if( responseJson.status == 'ok' ) {

          console.log('** Connect Channel Server ** \n', responseJson.result.server.url, {
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

          self.socket.on('message', (message) => { // MESSAGED RECEIVED
            console.log('[BACKGROUND] MESSAGE', message);
          });

          self.socket.connect();

        }else{
          console.console.warn(responseJson);
        }

      })
      .catch((error) => {
        console.warn('RN fetch exception', error);
      });


  }

  render() {

    console.log("this.props.user.isLoggedIn : ",this.props.user.isLoggedIn);

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
          hidden={!this.props.user.isLoggedIn}
          />
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

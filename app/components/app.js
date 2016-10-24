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
import { VERSION } from '../../env.js';

import AppNavigator from './navigator';
import PushController from './PushController';

class App extends Component {

  static propTypes = {
    isLoggedIn: React.PropTypes.bool.isRequired, // from store
    loadConfig: React.PropTypes.func.isRequired, // dispatch from actions
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // Load Configuration and update Installtaion datas into parse-server
    this.props.loadConfig();
    updateInstallation({VERSION});
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(currentAppState) {
    if (currentAppState === 'active') { // ( active, background, inactive )
      // TODO : HANDING STATUS OF APP WITH currentAppState
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
          hidden={!this.props.isLoggedIn}
          />
          <AppNavigator />

          { this.props.isLoggedIn ? <PushController /> : null }

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
    isLoggedIn: store.user.isLoggedIn,
  };
}

function actions(dispatch) {
  return {
    loadConfig: () => dispatch(loadConfig()),
  };
}

module.exports = connect(select, actions)(App);

/**
 *
 * Init Application
 * - Create Redux Store and set Provider
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import App from './components/app';

export default class Messenger extends Component {

  state = {
    isLoading: true,
    store: null,
  };

  componentDidMount() {
    var store = configureStore(() => this.setState({isLoading: false}));
    this.setState({store});
  }

  render() {

    if (this.state.isLoading) {
      return null;
    }

    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    );
  }

}

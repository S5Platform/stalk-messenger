/**
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ToolbarAndroid,
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
import S5Button from './S5Button';

export default class S5ListView extends Component {

  static propTypes = {

    onFetch: React.PropTypes.func.isRequired,
    rowView: React.PropTypes.func.isRequired,

    firstLoader: React.PropTypes.bool,   // display a loader for the first fetching
    pagination: React.PropTypes.bool,    // enable infinite scrolling using touch to load more
    refreshable: React.PropTypes.bool,   // enable pull-to-refresh for iOS and touch-to-refresh for Android
    withSections: React.PropTypes.bool,  // enable sections
    enableEmptySections: React.PropTypes.bool,

    refreshableTintColor: React.PropTypes.string,
    emptyView: React.PropTypes.func,
    paginationWaitingView: React.PropTypes.func,

  };

  static defaultProps = {
    onFetch(page, callback, options) { callback([]); },
    firstLoader: false,   // display a loader for the first fetching
    pagination: true,
    refreshable:false,
    withSections: false,
    enableEmptySections: true,
  };


  refresh() {
    if (this.s5ListView !== null) {
      this.s5ListView._refresh();
    }
  }

  paginationWaitingView = (paginateCallback) => {
    if (this.props.paginationWaitingView) {
      return this.props.paginationWaitingView(paginateCallback);
    }

    return (
      <S5Button
        type="secondary"
        caption="LOAD MORE"
        onPress={paginateCallback}
      />
    );
  }

  _paginationWaitingView(paginateCallback) {

    return (
      <S5Button
        type="secondary"
        caption="LOAD MORE"
        onPress={paginateCallback}
      />
    );
  }

  render() {
    return (
        <GiftedListView
          ref={(ref) => this.s5ListView = ref}
          rowView={this.props.rowView}
          onFetch={this.props.onFetch}
          firstLoader={this.props.firstLoader}
          pagination={this.props.pagination}
          refreshable={this.props.refreshable}
          withSections={this.props.withSections}
          enableEmptySections={this.props.enableEmptySections}
          refreshableTintColor="blue"
          paginationWaitingView={this.paginationWaitingView}
          paginationAllLoadedView={ () => null }
        />
    );
  }

}

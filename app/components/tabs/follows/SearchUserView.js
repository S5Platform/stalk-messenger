/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import { searchUsersByPage, createFollow, I18N } from 's5-action';
import { S5Colors, S5Header, S5TextInput, S5Button, S5ListView } from 's5-components';

import FollowCell from './FollowCell';

const PAGE_SIZE = 20;

class SearchUserView  extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    createFollow: React.PropTypes.func.isRequired,
  }

  state = {
    listViewData: [],
    filter: '',
  };

  /**
   * Will be called when refreshing
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch = (page = 1, callback, options) => {

    searchUsersByPage(
      {
        keyword: this.state.filter,
        pageNumber: page,
        pageSize: PAGE_SIZE
      }
    , function(err, result){

        let rows = result.map( (user) => {
          return {
            id: user.id,
            username: user.get('username'),
            email: user.get('email'),
            nickName: user.get('nickName'),
            statusMessage: user.get('statusMessage'),
            avatar: user.get('profileFile') ? user.get('profileFile').url() : '',
          };
        });

        if(rows.length < PAGE_SIZE){
          callback(rows, {
            allLoaded: true, // the end of the list is reached
          });
        } else {
          callback(rows);
        }
      });
  }

  _onChangeFilterText = (text) => {
    this.setState( {filter: text}, () => {

        if( this.timeout ) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.refs['listView'].refresh();
        }, 300 );

      }
    )
  }

  _renderRowView = (user) => {

    if( this.props.user.id == user.id) {
      return <FollowCell key={user.id} user={user} prefix={'ME'}/>
    } else if( this.props.ids.indexOf(user.id) > -1){
      return <FollowCell key={user.id} user={user} prefix={'FOLLOW'} />
    } else {
      return <FollowCell key={user.id} user={user}
        onPress={() => this.props.createFollow(user.id).then( () => this.props.navigator.pop() ) } />
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <S5Header
          title={I18N('searchUser.title')}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => {
            return this.props.navigator.pop()
          }}
        />
        <S5TextInput
          placeholder={I18N('searchUser.txtSearch')}
          value={this.state.filter}
          autoCapitalize="none"
          clearButtonMode="always"
          onChangeText={ this._onChangeFilterText }
          inputStyle={{ paddingLeft: 10 }}
        />
        <S5ListView
          ref="listView"
          rowView={this._renderRowView}
          onFetch={this._onFetch}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

function select(store) {
  return {
    user: store.user,
    ids: store.follows.ids,
  };
}

function actions(dispatch) {
  return {
    createFollow: (id) => dispatch(createFollow(id)),
  };
}

module.exports = connect(select, actions)(SearchUserView);

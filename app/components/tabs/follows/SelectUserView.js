/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ListView
} from 'react-native';

import FollowCell from './FollowCell';

import { loadFollows, addUsers, I18N } from 's5-action';
import { S5Header, S5SwipeListView } from 's5-components';
import { connect } from 'react-redux';

class SelectUserView extends Component {
  constructor(props) {
    super(props);

    this.checkedUsers = {};
    this.existUserIds = [];

    var chat = this.props.chat;
    if( this.props.navigation ){
      chat = this.props.navigation.state.params.chat;
    }

    this.state = {
      chat:chat,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (prev, next) => prev !== next
      }),
      listViewData: this.props.follows.list,
      filter: '',
    };

    if( this.state.chat && this.state.chat.users ){
      for( var inx = 0 ; inx < this.state.chat.users.length;inx++ ){
        this.existUserIds.push( this.state.chat.users[inx].username );
      }
    }
  }

  createChat = () =>{
    var users = [];
    var self = this;

    // channelId 가 생성되기 전 상태일때( 첫번째 메시지 발송 전 )
    var useCallback = false;
    if( this.state.chat && this.state.chat.users ){
      for( var inx in this.state.chat.users ){
        users.push( this.state.chat.users[inx] );
      }
      if( self.props.callback ){
        useCallback = true;
      }
    }

    for (var username in this.checkedUsers) {
      users.push(this.checkedUsers[username]);
    }

    if( users.length > 0 ){
      if( useCallback ){
        self.props.callback( 'C', users );
      } else {
        // 신규생성
        this.props.navigator.replace({
          name: 'ChatView',
          users,
        });
      }
    }
  }

  addUsers = () => {
    var self = this;
    var users = [];

    for (var prop in this.checkedUsers) {
      users.push(this.checkedUsers[prop].id);
    }

    if( users.length > 0 ){
      this.props.addUsers(this.state.chat.id, this.state.chat.channelId, users).then(
        (updatedChat) => {
          console.log('Add users', updatedChat );
          if( self.props.callback ){
            self.props.callback( 'A', updatedChat );
          }
        },
        (error)=> {
          console.log('ERROR....>', error);
        });
    } else {
      if( this.props.navigation ){
        this.props.navigation.goBack(null);
      } else {
        this.props.navigator.pop();
      }
    }
  }

  _renderRow = (user) => {

    var disabled = false;
    var checked = false;

    if( this.existUserIds.indexOf( user.username ) > -1 ){
      disabled = true;
      checked = true;
    }

    return (
      <FollowCell
        key={user.id}
        user={user}
        disabled ={disabled}
        checked={checked}
        onPress={(checked) => {
          if( checked ){
            this.checkedUsers[user.id] = user;
          } else {
            if( this.checkedUsers[user.id] ) delete this.checkedUsers[user.id];
          }
        } }
        selectable={true}
      />
    );
  }

  render(){

    const filterText = this.state.filter || '';
    const filterRegex = new RegExp(String(filterText), 'i');
    const filter = (user) => filterRegex.test(user.nickName);

    return(
      <View style={styles.container}>
        <S5Header
          title={I18N('selectUser.title')}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          rightItem={[ {icon: 'checkmark-circle-outline'} ]}
          onPress={ (name) => {
            if( name == 'checkmark-circle-outline' ) {
              if( this.state.chat && this.state.chat.channelId ){ // "channelId" existed
                return this.addUsers();
              } else {
                return this.createChat();
              }
            } else {
              if( this.props.navigation ){
                return this.props.navigation.goBack(null);
              } else {
                return this.props.navigator.pop();
              }
            }
          }}
        />
        <S5SwipeListView
          ref="listView"
          data={ this.state.listViewData.filter(filter) }
          renderRow={ this._renderRow }
          enableEmptySections={true}
          sectionKey="username"
          autoSection={true}
        />
      </View>
    )
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
    follows: store.follows,
  };
}

function actions(dispatch) {
  return {
    loadFollows: () => dispatch(loadFollows()),
    addUsers: (chatId, channelId, ids) => dispatch(addUsers(chatId, channelId, ids)),
  };
}

module.exports = connect(select, actions)(SelectUserView);

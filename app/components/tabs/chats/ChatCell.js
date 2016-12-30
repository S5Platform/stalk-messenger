/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  PixelRatio,
} from 'react-native';

import { S5ProfilePicture, S5GridPicture, S5Icon } from 's5-components';

export default class ChatCell extends Component {

  static propTypes = {
    chat: React.PropTypes.object.isRequired,
    message: React.PropTypes.string,
    onPress: React.PropTypes.func,
  };

  _renderProfilePictures = () => {

    let profiles = [];
    let alts = [];

    this.props.chat.users.forEach( (user) => {
      //let key = `${this.props.chat.channelId}_${user.id}`;
      profiles.push(user.avatar);
      alts.push(user.nickName);
    });

    return (
      <S5GridPicture size={48} style={{margin:10}} images={profiles} alts={alts}/>
    )
  }

  _renderLatestMessage = () => {
    if( this.props.message == '@image' ){
      return(
        <View style={{'flexDirection':'row'}}>
          <View>
            <S5Icon name={'image'} color={'#09aaf3'} size={20} />
          </View>
          <Text numberOfLines={1} style={[styles.messages,{paddingLeft:4}]}>Image</Text>
        </View>
      )
    }

    return(
      <Text numberOfLines={1} style={styles.messages}>
        {this.props.message}
      </Text>
    )
  }

  render() {
    // this.props.chat.name : the name of this channel (defined from chats reducer).
    // this.props.chat.users.length : count for users in this chat channel.

    let names = [];
    this.props.chat.users.forEach( (user) => {
      names.push(user.nickName);
    });

    const userCount = this.props.chat.users.length > 1 ?
      (<Text style={styles.userCount}>{this.props.chat.users.length}</Text>) : null;

    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={styles.container}>
          {this._renderProfilePictures()}
          <View style={styles.detailContainer}>
            <Text numberOfLines={1} style={styles.nickName}>
              {userCount} {names.join(", ")}
            </Text>
            {this._renderLatestMessage()}
          </View>
        </View>
      </TouchableHighlight>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFD',
  },
  detailContainer: {
    flex: 1,
    marginRight: 10,
  },
  nickName: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#000000'
  },
  userCount: {
    fontSize: 12,
    marginBottom: 5,
    color: '#DA552F'
  },
  messages: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray'
  }
})

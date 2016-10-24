/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import { connect }  from 'react-redux';
import { signup }   from 's5-action';
import { S5ProfilePicture, S5Button, S5Icon } from 's5-components';

class UserView extends Component {

  static propTypes = {
    navigator: React.PropTypes.any.isRequired,
    user: React.PropTypes.object.isRequired,
  };

  onPressChat = () => {
    this.props.navigator.replace({
      name: 'ChatView',
      users: [this.props.user]
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={{width:100,height:200,backgroundColor:'#FFFFFF'}}>
          </View>
          <S5ProfilePicture
            name={this.props.user.nickName}
            profileFileUrl={this.props.user.profileFileUrl}
            size={100}
          />
          <Text style={styles.nickName}>
            {this.props.user.nickName}
          </Text>
          <Text style={{marginTop: 10}}>
            {this.props.user.email}
          </Text>
          <View style={{marginTop: 15}}>
            <View style={styles.icon}>
              <S5Icon name={'chatboxes'} color={'#272822'} onPress={this.onPressChat}  />
            </View>
            <Text style={styles.iconText}>1:1 Chat</Text>
          </View>
        </View>
        <View style={styles.closeButton}>
          <S5Icon name={'close'} color={'grey'} onPress={() => this.props.navigator.pop()}  />
        </View>
      </View>
    );

  }

}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    left:20,
    top:20
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: undefined,
    height: undefined
  },
  nickName: {
    fontSize :20,
    paddingTop: 10
  },
  icon: {
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'#8f8f8f',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    marginTop:4,
    fontSize:8,
    textAlign: 'center',
  }
});

function actions(dispatch) {
  return {
    signup: (data, callback) => dispatch(signup(data, callback))
  };
}

module.exports = connect(null, actions)(UserView);

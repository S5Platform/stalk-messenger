/**
 *
 * @flow
 */

import React, { Component } from 'react';
import {
 View,
 StyleSheet,
 Text
} from 'react-native';

import { connect } from 'react-redux';
import { updateUser, I18N } from 's5-action';

import { S5Header, S5ProfilePicture } from 's5-components';

import ProfileCell from './ProfileCell';

var ImagePicker = require('react-native-image-picker');

class ProfileMain extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
  };

  selectImage(){
    ImagePicker.showImagePicker({
      title: 'Select Avatar',
      quality: 0.5,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }, (response) => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.props.dispatch(updateUser('profileFile',response.data));
      }
    });

  }

  onPressNickName(){
    this.props.navigator.push({name: 'ProfileForm', field:'nickName', title:'Nickname', validLength:20});
  }

  onPressStatusMessage(){
    this.props.navigator.push({name: 'ProfileForm', field:'statusMessage', title:'Status message'});
  }

  render() {

    return (
      <View style={styles.container}>

        <View style={styles.profileImage}>
          <S5ProfilePicture
            name={this.props.user.nickName}
            avatar={this.props.user.avatar}
            onPress={() => this.selectImage()}
            editable={true}
            size={100}
          />

          <Text style={{marginTop: 10}}>
            {this.props.user.email}
          </Text>
        </View>

        <ProfileCell
          label={I18N('profile.txtNickname')}
          text={this.props.user.nickName}
          onPress={() => this.onPressNickName()}
        />

        <ProfileCell
          label={I18N('profile.txtStatusMessage')}
          text={this.props.user.statusMessage}
          onPress={() => this.onPressStatusMessage()}
        />

      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileImage: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

module.exports = connect(select)(ProfileMain);

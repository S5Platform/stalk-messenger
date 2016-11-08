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
import { updateUser } from 's5-action';

import { S5Header, S5ProfilePicture } from 's5-components';

import ProfileCell from './ProfileCell';

var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Select Avatar',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class ProfileMain extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  selectImage(){
    ImagePicker.showImagePicker(options, (response) => {

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
            profileFileUrl={this.props.user.profileFileUrl}
            onPress={() => this.selectImage()}
            editable={true}
            size={100}
          />

          <Text style={{marginTop: 10}}>
            {this.props.user.email}
          </Text>
        </View>

        <ProfileCell
          label="Nickname"
          text={this.props.user.nickName}
          onPress={() => this.onPressNickName()}
        />

        <ProfileCell
          label="Status Message"
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
  button: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    alignSelf: 'stretch',
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

/**
 *
 * Folder 를 생성/수정하는 Form
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import { S5Header } from 's5-components';
import { logOut, updateUser } from 's5-action';

import DeviceInfo from 'react-native-device-info';

import TouchableItem from './TouchableItem';
import TouchableItemGroup from './TouchableItemGroup';

class SettingView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
  };

  _logout = () => {
    Alert.alert(
      'Alert',
      'Do you want to logout?',
      [
        {text: 'Logout', onPress: () => this.props.dispatch(logOut())  },
        {text: 'Cancel',  onPress: () => console.log('Cancel Pressed!') },
      ]
    )
  }

  _navPage(name){
    this.props.navigator.push({name});
  }

  render() {

    return(
      <View style={styles.container}>

        <S5Header
          title={'SETTINGS'}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => this.props.navigator.pop() }
        />
        <ScrollView
          style={styles.contentContainer} >

         <TouchableItemGroup style={styles.groupStyle} title='SETTINGS'>
           <TouchableItem text='Language' showArrow onPress={() => console.log("Edit Profile")}/>
           <TouchableItem text='Push Notification Settings' showArrow onPress={() => this._navPage('PushNotificationView')} />
         </TouchableItemGroup>

         <TouchableItemGroup style={styles.groupStyle} title='SUPPORT'>
           <TouchableItem text='Help Center' showArrow onPress={() => console.log("Help Center")}/>
           <TouchableItem text='Report a Problem' showArrow onPress={() => console.log("Report a Problem")}/>
         </TouchableItemGroup>

          <TouchableItemGroup style={styles.groupStyle} title='ABOUT'>
            <TouchableItem text='Privacy Policy' showArrow onPress={() => this._navPage('PrivacyPolicyView')}/>
            <TouchableItem text='Terms' showArrow onPress={() => console.log("Terms")}/>
            <TouchableItem text='License Information' showArrow onPress={() => this._navPage('LicenseView')}/>
          </TouchableItemGroup>

          <TouchableItemGroup style={styles.groupStyle}>
            <TouchableItem text='Clear Search History' onPress={() => console.log("Edit Profile")}/>
            <TouchableItem text='Log Out' onPress={ this._logout }/>
          </TouchableItemGroup>

          <Text style={styles.version}>Version {DeviceInfo.getReadableVersion()}</Text>

        </ScrollView>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
      backgroundColor: 'whitesmoke',
      paddingTop: 5,
      paddingBottom: 5,
      marginBottom: 2,
  },
  groupStyle: {
    marginVertical: 8,
  },
  version: {
    marginTop:8,
    marginLeft:15,
    paddingBottom: 10,
  },
});

function select(store) {
  return {
    user: store.user
  };
}

module.exports = connect(select)(SettingView);

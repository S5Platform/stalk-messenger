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
import { logOut, resetSetting, clearChats, I18N } from 's5-action';

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
      I18N('setting.msgConfirmLogout'),
      [
        {text: 'Logout', onPress: () => this.props.dispatch(logOut())  },
        {text: 'Cancel',  onPress: () => console.log('Cancel Pressed!') },
      ]
    )
  }

  _clearData = () => {
    Alert.alert(
      'Alert',
      I18N('setting.msgConfirmClearChat'),
      [
        {text: 'Clear', onPress: () => this.props.dispatch(clearChats())  },
        {text: 'Cancel',  onPress: () => console.log('Cancel Pressed!') },
      ]
    )
  }

  _resetSettings = () => {
    Alert.alert(
      'Alert',
      I18N('setting.msgConfirmReset'),
      [
        {text: 'Logout', onPress: () => this.props.dispatch(resetSetting())  },
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
          title={I18N('setting.title')}
          style={{backgroundColor: '#224488'}}
          leftItem={[ {icon: 'arrow-back'} ]}
          onPress={ (name) => this.props.navigator.pop() }
        />
        <ScrollView
          style={styles.contentContainer} >

         <TouchableItemGroup style={styles.groupStyle} title={I18N('setting.title')}>
           <TouchableItem text={I18N('setting.txtLanguage')} showArrow onPress={() => console.log("Edit Profile")}/>
           <TouchableItem leftIcon={'notifications'} text={I18N('setting.txtNotification')} showArrow onPress={() => this._navPage('PushNotificationView')} />
           <TouchableItem leftIcon={'image'} text={I18N('setting.txtImageQuality')} showArrow onPress={() => this._navPage('ImageQualityView')} />
         </TouchableItemGroup>

         <TouchableItemGroup style={styles.groupStyle} title={I18N('setting.txtSupport')}>
           <TouchableItem leftIcon={'help-circle'}  text={I18N('setting.txtHelpCenter')} showArrow onPress={() => console.log("Help Center")}/>
           <TouchableItem leftIcon={'bug'} text={I18N('setting.report')} showArrow onPress={() => console.log("Report a Problem")}/>
         </TouchableItemGroup>

          <TouchableItemGroup style={styles.groupStyle} title={I18N('setting.txtAbout')}>
            <TouchableItem text={I18N('setting.txtPolicy')} showArrow onPress={() => this._navPage('PrivacyPolicyView')}/>
            <TouchableItem text={I18N('setting.txtTerms')} showArrow onPress={() => console.log("Terms")}/>
            <TouchableItem text={I18N('setting.txtLicense')} showArrow onPress={() => this._navPage('LicenseView')}/>
          </TouchableItemGroup>

          <TouchableItemGroup style={styles.groupStyle}>
            <TouchableItem text={I18N('setting.txtClearHistory')} onPress={this._clearData}/>
            <TouchableItem text={I18N('setting.txtLogOut')} onPress={ this._logout }/>
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
